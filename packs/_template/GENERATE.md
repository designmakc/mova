<!-- mova:engine -->
# packs/_template/GENERATE.md — authoring a new language pack

> The playbook an agent follows to build `packs/<code>/` for a new target language.
> Contract: [../SPEC.md](../SPEC.md). Reference implementation: [../ro/](../ro/pack.md).
> The governing rule is the same as for teaching: **a language fact you cannot source is
> a language fact you mark unverified** — a pack is the one place a hallucination becomes
> curriculum, so this playbook is deliberately paranoid.

Copy the skeleton files from this directory into `packs/<code>/`, then work the steps in
order. Flip the ownership markers as you copy: `<!-- mova:engine -->` → `<!-- mova:pack -->`
in `.md`, `// mova:engine` → `// mova:pack` in `.mjs`.

## 1. Fill the manifest from stated facts only

`pack.md`: write the prose header (what the pack is, where its facts come from), then the
`mova-config` block. Every value must come from the human, a named reference, or a
verifiable source — voice ids from `edge-tts --list-voices` / `say -v '?'` output, the
level scale from the goal's assessment body, genders from a grammar you can cite. `code:`
must equal the directory name. If any key is unknown, leave it empty and say so in prose —
an empty key is honest; a guessed one teaches lies.

## 2. Build the POS tables — source-or-unverified, per row

`pos-tables.mjs`: fill `TABLES` per the shape comments (canonical docs: `scripts/pos.mjs`
docblock).

- Start from how the LEDGER will say part of speech: which parenthetical tags exist, what
  each maps to. Gender letters map to `noun`; keep tags short and unambiguous.
- **The `endings` list carries a citation or an `// unverified` comment on every row.**
  It is not the language's complete morphology — it is the endings the level actually
  teaches, longest first, because the list decides where `markPair` cuts a form. When in
  doubt, leave an ending out: a missing ending degrades to a harmless stem-diff; a wrong
  one mis-marks every word it touches.
- `verbHeadword` only if the language really marks infinitives in the citation form
  (ro: `a `); otherwise `null` and verbs take an explicit tag.
- No grammatical gender ⇒ `genders: []`, `article: {}`, and `inflection: false` in the
  manifest if there is no form-marking to teach.

## 3. Build the golden fixtures — real words, verified expectations

`golden/` (format: [golden/README.md](golden/README.md), enforced by packcheck):

- `words.json`: ~30 REAL words of the language, spanning every facet in `types`, written
  exactly as ledger rows will write them (tags in the parenthetical). Include at least
  one untagged bare word with `expected: null`. Each expectation is what the classifier
  SHOULD say — derived from the word's actual part of speech per your source, not from
  running your own untested tables and copying the answer back (that proves nothing).
  Porting an existing classifier? Generate expectations by running IT — that is how
  `packs/ro/` proves behavior-identity with limba.
- `pairs.json`: ~15 real inflection pairs (dictionary-attested forms), including one
  identical pair and one stem-change pair. Run the pair through `createClassifier(TABLES)
  .markPair` and **eyeball every marked output**: `mk` must sit on the ending, `st` on
  the stem shift — if a fake stem change appears, fix the `endings` list, then freeze the
  output as `expected`.
- `normalize.json`: one fixture per look-alike your learner's keyboard can produce, an
  NFD case, an identity case, and a missing-diacritic case that must pass through
  unchanged.

## 4. Pass packcheck

```
node scripts/packcheck.mjs <code>
```

Fix the pack until it exits 0 — structure, manifest/tables consistency, every golden,
residue rate under 20%. CI runs the same check for every pack; do not exclude your pack
from it.

## 5. Declare the dictionary honestly

If a machine-queryable dictionary exists for the language, implement `dictionary.mjs`
against the adapter contract in `scripts/dictionary.mjs` (network only inside `lookup()`,
honest User-Agent, timeout, `found:false` ≠ unreachable). **If none exists, do not fake
one**: leave the manifest's `dictionary:` empty and state in the pack prose that facts
need tutor confirmation or the unverified marker. Test the adapter by hand on a few known
words (`node -e`) — packcheck deliberately never touches the network.

Only after all five steps may a session claim the pack works — and `notes.md` still needs
its prose (error-code candidates, resource registry, materials sources, grammar system
inventory) before setup can generate a good instance from it. Model it on
[../ro/notes.md](../ro/notes.md).
