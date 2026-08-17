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
    words.json      classification fixtures                             (required)
    pairs.json      markPair fixtures                                   (required if inflection)
    normalize.json  normalization fixtures                              (required)
    dictionary.json recorded lookups, replayed offline                  (expected if dictionary.mjs)
```

Ownership markers: first line `<!-- mova:pack -->` in `.md`, `// mova:pack` in `.mjs`.

**Pack files are never in `upstream/manifest.json`.** That manifest is `/update`'s allowlist
for engine files, and hashing a pack would make every update flag a learner's own correction
to their language facts. The cost of that exclusion is that a shipped pack could not reach an
existing instance at all, so a second baseline exists: **`upstream/packs.json`**, written by
the same release ritual, hashing every shipped pack file. It grants no permission to
overwrite anything — it only lets `/update` tell a template's pack from a setup-generated one
([playbooks/update.md](../playbooks/update.md) § 6b). The offer itself is always gated on
`node scripts/packdiff.mjs`, which runs both classifiers over the rows in `state/` and
reports what would break for that learner.

## Manifest — `pack.md`

Prose first (what the pack is, where its facts come from), then exactly one fenced
` ```mova-config ` block, parsed by `scripts/pack.mjs` (same grammar as the profile block:
`key: value` per line, snake_case keys, `#` comments, unknown keys preserved).

| Key | Type | Semantics | May be empty |
| --- | --- | --- | --- |
| `language` | string | Human name, e.g. `Romanian`. | no |
| `code` | string | Pack id; MUST equal the directory name. The profile's `pack:` points at it. | no |
| `genders` | list | Gender labels, e.g. `m f n`. Drives the `--g-*` visual tokens and the ledger's noun tags. MUST equal `TABLES.genders`. | yes — empty means no grammatical gender |
| `inflection` | `true`/`false` | `false` switches off morpheme-marking machinery everywhere (deck, teaching's "mark what changes", pairs goldens). **The one flag that DELETES a required fixture** — so packcheck cross-examines it against the pack's own data: with `false`, `TABLES.endings` must be empty and no golden row may carry a second form differing from its headword. | no |
| `level_scale` | list | Proficiency rungs, e.g. `A1 A2 B1 B2 C1 C2`. Curriculum headings and snapshots use it. | yes — defaults to CEFR |
| `tts_edge` | string | edge-tts neural voice id (e.g. `ro-RO-EmilNeural`). | yes — no edge voice |
| `tts_say` | string | macOS `say` voice name — the offline fallback. | yes — no say voice |
| `stt_lang` | string | whisper.cpp language flag for the pronunciation round-trip. | yes — no STT |
| `required_fact` | string | The one unpredictable fact a ledger row of the flagged class must carry (ro: `eu-form` on verbs), enforced by `state/ledgers.test.ts`. | yes — no such fact |
| `dictionary` | string | Adapter source name (ro: `dexonline`). Non-empty ⇒ `dictionary.mjs` must exist. **Empty ⇒ the pack has no dictionary and must SAY so** — facts then need tutor confirmation or the unverified marker per `docs/mechanics/verification.md`. | yes — but honesty required |

### An empty key is a decision, and a decision is stated

"May be empty" never means "may be left blank in silence". **Every key left empty must be
named in the pack's prose header** (or in a `#` comment on its own line), together with
what the pack loses by it — packcheck fails the pack otherwise. An empty key switches a
guard off, and a guard that switches off without a sentence is a guard nobody knows is
gone: the first agent-generated pack left `required_fact:` blank on a language whose noun
plurals are the definition of an unpredictable per-lexeme fact, said nothing, and
`state/ledgers.test.ts` quietly stopped checking anything. (Found in the first
agent-generated language pack, 2026-08-15.)

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

`export const LOOKALIKES` is the map, and packcheck reads it directly:

- **A key never equals its value.** An entry maps a look-alike CODEPOINT from another
  alphabet (`ǎ` U+01CE) or a keyboard digraph (`ae`) to the target letter. `"ä": "ä"`
  folds nothing; a map of nothing but such entries is a normalizer that is the identity
  function while the pack advertises folding. That is what shipped. (Found in the first
  agent-generated language pack, 2026-08-15.)
- **A key is written NFC.** `normalize()` composes to NFC before folding, so an NFD key
  can never match — it is dead on arrival and looks alive.
- **A fold the prose claims is a fold packcheck runs.** Every `x → y` in a pack.md line
  that talks about folding is executed through `normalize()`; the claim fails if the
  function does not perform it. Advertise nothing you have not implemented.

## `dictionary.mjs`

Optional. `export function createAdapter(options?)` returning the contract defined in
`scripts/dictionary.mjs` (the canonical docblock):

```
{ source: string, async lookup(word) → { found, source, genders: string[], forms: string[], url } }
```

Rules: network traffic only inside `lookup()` (import and `createAdapter()` are
side-effect free); honest User-Agent, sane timeout, no retries; `found: false` for a
missing entry, **throw** when the source is unreachable — "offline" and "not in the
dictionary" must never be confused. When `options.fetch` is passed, use it instead of the
global `fetch`; that is what makes `golden/dictionary.json` possible. A pack without a
dictionary omits the file and leaves the manifest key empty — `loadPack()` then supplies
the null adapter.

**`genders` is a list because a headword has senses.** Romanian `calculator` is neuter as
*computer* and masculine as *person who calculates*; `ochi` is a noun and a verb. Report
everything the source states for the headword and let `factcheck.mjs` apply the rule that
one attesting sense is attestation.

### What a dictionary adapter gets wrong — read this before writing one

Every one of these was live in the reference pack and was measured, not imagined: over a
real 79-row ledger the first ro adapter returned **14 wrong verdicts**, 12 of them
contradictions against correct rows (2026-08-15). A verification tool that cries wolf on
18% of a clean ledger is worse than none, because the learner stops reading it.

1. **Do not read a window of the results.** The adapter read the first 6 of up to 184
   entries; `obraz` has 42 and every parseable one is past index 6, so a dictionary word
   came back NOT FOUND. Read all of them.
2. **Match the headword.** Aggregators return entries that merely *mention* the query —
   asking for `carte` returns `scorpion`, whose definition contains it. An entry that is
   not ABOUT the word contributes nothing, and this is also what keeps a mis-parsed entry
   from asserting facts.
3. **Normalize the inflected form.** The slot that usually holds a plural also holds
   syllabification (`(pri-e-)`), variant endings (`prieteni, -e` = the plural plus the
   feminine counterpart's ending), and homograph markers (`vârstă^1`). Reduce it to one
   word, or to nothing.
4. **`found` means "the source has an entry for this word"** — not "the request
   succeeded". Answering `found: true` on a word with no entry is how the workspace
   fabricates a fact.

## `golden/` — fixtures, and how packcheck runs them

The goldens are the pack's behavior proof. For the reference pack they were generated by
running limba's original classifier, so engine and pack are provably behavior-identical
after the split; for a new pack they encode facts the author verified (see GENERATE.md).

- `dictionary.json` — `{ source, recorded, cases: [{ word, why, expect, response }] }`.
  Each `response` is a real recorded reply from the source (trim the bodies — keep whatever
  the parser reads); packcheck replays it through `options.fetch` and asserts
  `lookup(word)` returns `expect` (`found`, `genders`, `forms`, order-insensitive). **At
  least one case must expect `found: false`** — the not-in-the-dictionary branch is exactly
  where a parser invents facts. `why` names the failure the case pins, so an author
  changing an expectation has to say what changed. Missing the file is a warning, not an
  error: it is possible to ship without it, and the reference pack did, and that is how
  four defects reached a template whose users cannot check its Romanian.
- `words.json` — `[{ target, id, expected }]`, ~30 real words spanning every facet, plus
  at least one untagged bare word with `expected: null` (the CI-failure case). packcheck
  asserts `classify(target, id) === expected` for each, that **every facet in `types` is
  exercised at least once** (a facet the deck shows and no fixture reaches is untested),
  that ids and targets are unique, and that nulls + `TABLES.other` results stay under 20%
  of the set.
- `pairs.json` — `[{ sg, pl, expected: { sg, pl } }]`, ~15 real form pairs; `expected` is
  `markPair`'s marked HTML. Required when `inflection: true`; must include an
  identical-forms pair (marked nowhere) and a stem-change pair (two colours).
- `normalize.json` — `[{ input, expected, note }]`: every look-alike the pack folds, an
  NFD-composition case, an already-canonical identity case, and a missing-diacritic case
  proving normalize does NOT repair language errors.

**A fixture set that would pass against `s => s` proves nothing.** packcheck therefore
requires, in `normalize.json`: at least one fixture where `input !== expected` whenever the
pack folds or claims to fold, and at least one NFD input. Coverage of every look-alike in
the map is reported when it is short. Six identity fixtures, all four kinds collapsed into
one, is the shape a hollow pack takes — it passed the old check. (Found in the first
agent-generated language pack, 2026-08-15.)

`node scripts/packcheck.mjs <code>` runs structure checks plus every fixture, offline,
exit 1 on any failure. CI runs it for all packs via `scripts/packcheck.test.ts`, which
also keeps negative tests: each hollow-pack check is proven to fire against a deliberately
broken copy of `packs/ro`.

## `notes.md` — the prose setup mines

Required. Error-taxonomy reference, resource registry, materials sources, grammar system
inventory — the raw material `setup/templates/` turns into an instance's
`docs/mechanics/error_taxonomy.md` and `docs/reference/transfer.md`. Model it on
[ro/notes.md](ro/notes.md), and re-rank the interference notes for the actual language
pair; a code that the learner's held languages make irrelevant is not ported.

**Every error-taxonomy example row must show a contrast.** The ✗ marks the wrong form; the
correction follows `→`. packcheck lints the table and fails a row where the wrong form
equals the correction, where the same form appears on both sides, or where the ✗ sits on a
form the row itself calls correct. Four such rows shipped, and two of them propagated
verbatim into the generated instance — an error code whose worked example contradicts
itself teaches the learner nothing and gives the tally a target it cannot name. (Found in
the first agent-generated language pack, 2026-08-15.)

**A false-friend row corrects into the target language, never into the held one.** `→` names
the form the learner should have written. `✗ *aktuell* (current) → actual` shows a contrast
and is still wrong: `actual` is the English partner of the false friend, so the row points at
the confusion instead of the repair. Write the meaning in quotes on the ✗ side and put the
target form after the arrow — `✗ *aktuell* meant as "actual" → tatsächlich`. packcheck fails
a false-friend row whose two sides look alike, and ONLY a false-friend row: a diacritics row
like `✗ *fara* → fără` is supposed to look near-identical. (Found in the generated German
instance, 2026-08-15.)

## Pack authoring — safety rules

A pack states language facts that will be TAUGHT. The bar is the same as
`docs/mechanics/verification.md` sets for teaching:

1. **Facts from stated sources only.** Every endings row, tag, article and voice name is
   either cited (source named in a comment or the pack prose) or explicitly marked
   `unverified` — never silently guessed from the model's memory. **A citation covers the
   rows it was checked against, not the block it sits above.** The German pack put
   `Source: … (Duden)` over an endings list containing `-el` and `-le`, which are not
   German plural endings at all — the citation was decoration on a guess, and decoration
   is worse than an `// unverified` comment because it stops the next reader looking.
   (Found in the first agent-generated language pack, 2026-08-15.)
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
5. **A claim in prose is a claim under test.** Anything the pack says about itself — what
   it folds, what it marks, what its docblocks explain — is checkable and gets checked.
   Prose that describes the reference language instead of this one is the same failure in
   a friendlier costume: the German pack wrote "no article-based case marking like
   Romanian", which is backwards on both languages, and explained a `verbHeadword: null`
   with "German infinitives are typically cited with `zu`", which is false. Setup mines
   these files; a wrong reason survives longer than a wrong value, because the value gets
   run and the reason does not.
6. **Copy the reference pack's SHAPE, never its content.** `packs/ro/` is the worked
   example, and the fastest way to a hollow pack is to copy it and translate the parts you
   notice. Two German paradigm rows shipped the Romanian label `prezent`; packcheck warns
   when a pack's goldens share vocabulary with `packs/ro/golden/`, but the warning catches
   only what is spelled the same. Re-derive every row from a German source.
