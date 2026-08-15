<!-- mova:engine -->
# docs/assets/ — the README's screenshots

Four images, all from one **synthetic** workspace: an English speaker learning Spanish, six
weeks in, 63 days from a B1 exam. The learner, the ledger rows, the session log and the
error log are invented. The pages are not — they are what `scripts/hub.mjs`,
`scripts/deck.mjs` and a page built from `docs/visual/starter.html` actually output over
that content, so a screenshot cannot show a layout the product does not produce.

| File | Surface | Where it appears |
| --- | --- | --- |
| `hub.png` | `work/visuals/index.html`, top of the page | README hero |
| `unit-board.png` | one expanded unit card from the same hub | "What it tracks" — taught against retained |
| `study-page.png` | a teach page built from the starter | "How you use it" — the three surfaces |
| `deck.png` | `work/visuals/deck.html` | "How you use it" — the three surfaces |

**To remake them** after a layout change: build a throwaway instance outside this repo —
a `docs/reference/profile.md` config block, `curriculum.md`, `reference/topics.md`,
`plan.md`, both `state/` ledgers, the two logs and `work/visuals/README.md` — run the two
generators over it, and screenshot at a 1100 px viewport with a 2× device pixel ratio. The
Spanish pack used for the shots is not in this repo and does not need to be: any pack the
target language actually has will do, since the images are of the engine, not of Spanish.

Keep the invented content invented. A screenshot that shows a real learner's ledger is that
learner's private study record, and this repo is public.
