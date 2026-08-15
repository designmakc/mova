<!-- mova:engine -->
# golden/ — fixture format

> The pack's behavior proof, run offline by `node scripts/packcheck.mjs <code>` and by CI.
> Real words only, expectations verified per [../GENERATE.md](../GENERATE.md) step 3 —
> never generated from the untested tables themselves. Reference: `packs/ro/golden/`.

**The test a fixture set has to survive: would it still pass if the code under it did
nothing?** Six German normalize fixtures were all identity cases, so the set passed against
`s => s` while the pack advertised umlaut folding — and packcheck said `ok`. Every check
below marked **enforced** exists because that shipped. (Found in the first agent-generated
language pack, 2026-08-15.)

## words.json — classification

```json
[
  { "target": "prieten (m, prieteni)", "id": "V-0004", "expected": "noun" },
  { "target": "azi",                   "id": "V-9999", "expected": null }
]
```

- `target` — the ledger cell exactly as a row would write it (tags in the parenthetical).
- `id` — a ledger id; `G-…` ids must classify as `"pattern"`.
- `expected` — the facet key `classify(target, id)` must return, or `null` for an
  untagged bare word (include at least one — null is the CI-failure case and the
  classifier must produce it, not paper over it).
- ~30 entries; **enforced**: every facet in `types` is exercised at least once, ids and
  targets are unique, and nulls + the `other` facet stay under 20% of the set.
- **enforced**: under `inflection: false`, no tagged row may carry a second form differing
  from its headword. `Buch (n, Bücher)` is a two-colour marking case; a manifest that
  switched the marking off is contradicted by its own fixture.
- Read every row once for reference-pack residue and for completeness. A German paradigm
  row shipped as `haben, prezent (habe, hat, haben, habt)` — Romanian label, and *hast*
  missing, freezing a conjugation error into the behavior proof.

## pairs.json — markPair (required when the manifest says `inflection: true`)

```json
[
  { "sg": "carte", "pl": "cărți",
    "expected": { "sg": "c<b class=\"st\">a</b>rte…", "pl": "…" } }
]
```

- `sg`/`pl` — two attested forms of one real word.
- `expected` — `markPair(sg, pl)`'s exact HTML: `mk` marks the ending added, `st` a stem
  shift underneath it. Eyeball each before freezing (GENERATE.md step 3).
- ~15 pairs, including one identical pair (`ochi`/`ochi` — marked nowhere) and one
  stem-change pair (two colours).

## normalize.json — input folding

```json
[
  { "input": "fǎrǎ",   "expected": "fără",   "note": "ǎ U+01CE (caron) → ă U+0103" },
  { "input": "fa\u0306ra\u0306", "expected": "fără", "note": "NFD paste — a + combining breve" },
  { "input": "adresa", "expected": "adresa", "note": "missing diacritic — never folded" }
]
```

Four kinds, and the `note` says which kind each row is:

| Kind | Shape | Status |
| --- | --- | --- |
| one per look-alike in the map, uppercase included | `input !== expected` | **enforced**: at least one such row whenever the pack folds or claims to fold; uncovered map entries are warned |
| NFD composition (macOS paste) | `input` is decomposed | **enforced** whenever the language has non-ASCII letters |
| already canonical | `input === expected` | expected, not enforced |
| missing diacritic | `input === expected` | expected, not enforced — proves normalize repairs the input method only, never the language |

The last two kinds are the cheap ones. A set that contains only those is a set that proves
nothing.
