<!-- mova:engine -->
# golden/ — fixture format

> The pack's behavior proof, run offline by `node scripts/packcheck.mjs <code>` and by CI.
> Real words only, expectations verified per [../GENERATE.md](../GENERATE.md) step 3 —
> never generated from the untested tables themselves. Reference: `packs/ro/golden/`.

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
- ~30 entries spanning every facet; packcheck fails the pack when nulls + the `other`
  facet exceed 20% of the set.

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
  { "input": "adresa", "expected": "adresa", "note": "missing diacritic — never folded" }
]
```

- One fixture per look-alike in the pack's map (uppercase included), an NFD-composition
  case, an already-canonical identity case, and a missing-diacritic case proving
  normalize repairs the input method only, never the language.
