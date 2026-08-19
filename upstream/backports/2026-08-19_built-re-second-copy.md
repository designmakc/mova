<!-- mova:engine -->
# `BUILT_RE` has a second copy, inside the change that named it

**Owed to limba.** Found porting PORT-022/023 into mova 0.16.0. Nothing is broken in limba
today — the two copies are character-identical — so this is a latent-drift report, not a bug
report. It is worth sending because mova's equivalent copy *had* already drifted, and the
failure it produced is exactly the one `sources.mjs` exists to prevent.

## What is there

`scripts/sources.mjs:566` declares:

```js
export const BUILT_RE = /^\s*(\*\*)?Built(\*\*)?\s*[—-]/;
```

and its own docstring says the point of declaring it there is that *"the registry, the hub and
docs/visuals.index.test.ts all read one definition of the shape."*

`docs/visuals.index.test.ts:111` then declares the same literal again, locally, and uses that
one. The test never imports the export. So the sentence in the docstring describes an intent
the code does not implement — which is the kind of gap that reads as settled every time
someone checks the comment instead of the import.

## Why it matters even though the two agree today

The two readers answer the same question — *is this row a page that was built and not yet
taught?* — for two different consumers: `unitState()` decides what the hub says about the
unit, and the test decides whether CI accepts the row. When they disagree, the workspace
contradicts itself in the most confusing possible way: a correctly staged page fails CI while
the hub reports the unit as having material waiting, and neither surface is obviously wrong.

That is not hypothetical. mova's copy of this test predated the extraction and refused the
**bold** form (`**Built —**`) that rows are actually written in, while its `unitState()`
accepted it. The staged rows failed the index test and read as staged on the hub in the same
run. Porting `BUILT_RE` as an import fixed both at once.

Whoever next widens the marker — a different dash, a new prefix, a row shape a pack needs —
will widen one copy. There is no test that would notice.

## Where it lands in limba

- `docs/visuals.index.test.ts` — the local `BUILT_RE` at line 111.
- `scripts/sources.mjs` — already exports it; no change expected there.

## What is genuinely open, and left to the limba session

**Whether a test importing from `scripts/` is acceptable in limba's own conventions.** mova
already does this in two places (`FIXTURE_DATE` from `visualcheck.mjs`, and now `gradedScore`
from `sources.mjs`), and treats such an import as *the contract itself* rather than as
convenience — the reason the graded-check gate cannot drift from the parser is that it cannot
run without it. limba may hold a different line about test-to-script imports, and if so the
alternative is a test that asserts the two literals are equal, which is weaker but still
closes the silent case.

The choice between those two is limba's, and so is whether this is worth a commit at all
given nothing is currently failing. The finding is the drift risk; the remedy is not
prescribed.
