<!-- mova:engine -->
# packs/SPEC.md — the language-pack contract

> What a `packs/<code>/` directory must contain and guarantee. `scripts/pack.mjs` is the
> only importer (everything downstream goes through `loadPack()` — never import a pack
> file directly); `scripts/packcheck.mjs` is the enforcer (`node scripts/packcheck.mjs
> <code>`, and `scripts/packcheck.test.ts` runs it for every pack in CI). `packs/ro/` is
> the reference implementation, extracted from limba; `packs/_template/GENERATE.md` is
> the authoring playbook.

## Directory layout

```
packs/<code>/
  pack.md          manifest — prose header + one ```mova-config block   (required)
  pos-tables.mjs   export TABLES — tag grammar + inflection endings     (required)
  normalize.mjs    export normalize(s) — input look-alike folding       (required)
  dictionary.mjs   export createAdapter() — fact verification           (optional)
  notes.md         prose language facts for setup generation            (required)
  golden/
    words.json     classification fixtures                              (required)
    pairs.json     markPair fixtures                                    (required if inflection)
    normalize.json normalization fixtures                               (required)
```

Ownership markers: first line `<!-- mova:pack -->` in `.md`, `// mova:pack` in `.mjs`.

## Manifest — `pack.md`

Prose first (what the pack is, where its facts come from), then exactly one fenced
` ```mova-config ` block, parsed by `scripts/pack.mjs` (same grammar as the profile block:
`key: value` per line, snake_case keys, `#` comments, unknown keys preserved).

| Key | Type | Semantics | May be empty |
| --- | --- | --- | --- |
| `language` | string | Human name, e.g. `Romanian`. | no |
| `code` | string | Pack id; MUST equal the directory name. The profile's `pack:` points at it. | no |
| `genders` | list | Gender labels, e.g. `m f n`. Drives the `--g-*` visual tokens and the ledger's noun tags. MUST equal `TABLES.genders`. | yes — empty means no grammatical gender |
| `inflection` | `true`/`false` | `false` switches off morpheme-marking machinery everywhere (deck, teaching's "mark what changes", pairs goldens). | no |
| `level_scale` | list | Proficiency rungs, e.g. `A1 A2 B1 B2 C1 C2`. Curriculum headings and snapshots use it. | yes — defaults to CEFR |
| `tts_edge` | string | edge-tts neural voice id (e.g. `ro-RO-EmilNeural`). | yes — no edge voice |
| `tts_say` | string | macOS `say` voice name — the offline fallback. | yes — no say voice |
| `stt_lang` | string | whisper.cpp language flag for the pronunciation round-trip. | yes — no STT |
| `required_fact` | string | The one unpredictable fact a ledger row of the flagged class must carry (ro: `eu-form` on verbs), enforced by `state/ledgers.test.ts`. | yes — no such fact |
| `dictionary` | string | Adapter source name (ro: `dexonline`). Non-empty ⇒ `dictionary.mjs` must exist. **Empty ⇒ the pack has no dictionary and must SAY so** — facts then need tutor confirmation or the unverified marker per `docs/mechanics/verification.md`. | yes — but honesty required |

## `pos-tables.mjs` — the TABLES shape

The canonical documentation lives in the driver's docblock (`scripts/pos.mjs`) — this
table mirrors it. `createClassifier(TABLES)` returns the classifier API
(`TYPES, TYPE_LABEL, ARTICLE, classify, markPair, speech, parse`) that both the deck and
the ledgers test consume — one classifier, two consumers.

| Field | Type | Semantics |
| --- | --- | --- |
| `types` | `[{key, label}]` | Facet order on the deck; `label` is the plural chip text. Must include `phrase` and `pattern` (the engine assigns those itself) plus every facet `tags` maps to. |
| `typeLabel` | `{key: label}` | Singular chip text; one entry per `types` key. |
| `tags` | `{tag: key}` | Parenthetical first-slot tags → facet. A gender letter maps to `noun`. |
| `genders` | `string[]` | The tags that are gender letters. `[]` when the language has none. Must match the manifest's `genders:`. |
| `endings` | `string[]` | Inflection endings the level actually teaches, **longest first** — the list decides where `markPair` cuts a form. `[]` allowed when `inflection: false`. |
| `article` | `{g: {sg, pl}}` | Count-article pair per gender, spoken by `speech()`. `{}` when articles don't exist. |
| `verbHeadword` | `RegExp \| null` | An untagged headword matching this is a verb (ro: `/^a\s+\S/`). `null` ⇒ verbs need an explicit tag. |
| `other` | `key \| null` | The residue facet null-classified rows are filed under on the deck. packcheck keeps the golden set's null+other rate under 20%. |
| `requiredFact` | `{ rowPattern, factPattern, hint }` — optional | The manifest's `required_fact:` made checkable: ledger rows whose target matches `rowPattern` must carry `factPattern` in notes (ro: verbs carry their eu-form). Omit ⇒ `state/ledgers.test.ts`'s check is inert; a manifest that declares `required_fact:` without this table entry declares an unenforceable rule — say so in the manifest comment. |
| `trivial` | `[words]` — optional | Function words `leakcheck.mjs` won't report as solo leaks (still checked inside full answers). Omit ⇒ only a length filter applies. |

## `normalize.mjs`

`export function normalize(s): string` — NFC normalization plus folding of input-method
look-alikes (dead-key neighbours of target letters) into the real letters. The governing
principle: **input method is never a language error** — fold it silently; a genuinely
missing diacritic is a language error and must pass through untouched. Idempotent. The
look-alike list is open; extend it (with a golden fixture) the session a new one appears.

## `dictionary.mjs`

Optional. `export function createAdapter()` returning the contract defined in
`scripts/dictionary.mjs` (the canonical docblock):

```
{ source: string, async lookup(word) → { found, source, gender, forms, url } }
```

Rules: network traffic only inside `lookup()` (import and `createAdapter()` are
side-effect free — packcheck instantiates the adapter but never calls `lookup`); honest
User-Agent, sane timeout, no retries; `found: false` for a missing entry, **throw** when
the source is unreachable — "offline" and "not in the dictionary" must never be confused.
A pack without a dictionary omits the file and leaves the manifest key empty —
`loadPack()` then supplies the null adapter.

## `golden/` — fixtures, and how packcheck runs them

The goldens are the pack's behavior proof. For the reference pack they were generated by
running limba's original classifier, so engine and pack are provably behavior-identical
after the split; for a new pack they encode facts the author verified (see GENERATE.md).

- `words.json` — `[{ target, id, expected }]`, ~30 real words spanning every facet, plus
  at least one untagged bare word with `expected: null` (the CI-failure case). packcheck
  asserts `classify(target, id) === expected` for each, and that nulls + `TABLES.other`
  results stay under 20% of the set.
- `pairs.json` — `[{ sg, pl, expected: { sg, pl } }]`, ~15 real form pairs; `expected` is
  `markPair`'s marked HTML. Required when `inflection: true`; must include an
  identical-forms pair (marked nowhere) and a stem-change pair (two colours).
- `normalize.json` — `[{ input, expected, note }]`: every look-alike the pack folds, an
  NFD-composition case, an already-canonical identity case, and a missing-diacritic case
  proving normalize does NOT repair language errors.

`node scripts/packcheck.mjs <code>` runs structure checks plus every fixture, offline,
exit 1 on any failure. CI runs it for all packs via `scripts/packcheck.test.ts`.

## Pack authoring — safety rules

A pack states language facts that will be TAUGHT. The bar is the same as
`docs/mechanics/verification.md` sets for teaching:

1. **Facts from stated sources only.** Every endings row, tag, article and voice name is
   either cited (source named in a comment or the pack prose) or explicitly marked
   `unverified` — never silently guessed from the model's memory.
2. **No dictionary ⇒ say so in the manifest** (empty `dictionary:` key and a prose line).
   The instance's verification policy tightens accordingly; a missing dictionary is
   honest, never silent.
3. **Goldens before claims.** An agent may claim a pack works only after
   `node scripts/packcheck.mjs <code>` passes on fixtures built from REAL words the
   author verified — for a port, generated from the upstream implementation's actual
   output; never from the untested tables themselves by circular reasoning.
4. **The residue stays small.** If more than a fifth of representative words land in the
   `other` facet or classify to null, the tag grammar is too sparse to teach with — grow
   the tables, don't relax the check.
