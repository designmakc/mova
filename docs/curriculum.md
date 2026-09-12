<!-- mova:instance -->
# Curriculum — U01–U12, true beginner to functional UX/UI reading & writing

> The ordered unit map: the goal's five scenarios (`docs/reference/goal.md`) arranged into
> 12 themed units, sequenced from the learner's true-beginner self-report
> (`docs/snapshots/2026-09-12_intake.md`) toward the reading/writing-heavy functional goal.
> **Rolling wave**: the first three units are drafted in full; later ones are deliberately
> coarse and get detailed at each phase entry, informed by the error log. The placement
> session (the first `lesson`) will correct this guess where the learner turns out to
> already hold more (or less) than the self-report suggests.
>
> Conventions: each unit carries exactly one `status:` line — `pending` or
> `covered YYYY-MM-DD` (flipped by the lesson verb when the unit's last session closes;
> enforced by `curriculum.test.ts`). Sources are citations only. Assessment-section
> letters: **R** Reading · **W** Writing · **L** Listening (no **S** — speaking was never
> named as a goal; see goal.md § Non-goals).

---

## Phase 1 — Foundations: articles, sentence structure, core UX vocabulary

## U01 — Articles and basic sentence structure (A1)
status: pending
- **Grammar:** a/an vs the (T-0004); basic SVO sentence structure (T-0022); overview of
  English's sound-to-spelling mismatch, framing why spelling will need deliberate practice
  (T-0001).
- **Vocab domain:** core product-design nouns — design, interface, layout, component,
  feature, project, team (~15 items).
- **Can-do:** write a simple, grammatically complete sentence describing a UI element
  ("The button is a component of the layout."), with an article in the right slot more
  often than not.
- **Assessment sections:** R W
- **Sources:** cite by topic once owned — no material acquired yet; `packs/en/notes.md`
  grammar-system inventory and `docs/reference/transfer.md` § Morphology traps for the
  article gap.
- **Transfer notes:** articles have no Russian/Ukrainian equivalent at all
  (`transfer.md` § Morphology traps) — the single highest-traffic trap for this learner;
  expect ART-MISS to dominate here, not ART-CHOICE. (assumed)
- **Media:** text-first — no audio channel on this machine (`docs/reference/profile.md`);
  visual aids (the deck, `work/visuals/deck.html`) carry what would otherwise be spoken.

## U02 — Present tense and everyday verbs (A1)
status: pending
- **Grammar:** present simple (T-0010); third-person singular -s (the ONE marked form in
  an otherwise unmarked paradigm — see transfer.md); regular noun plurals -s/-es/-ies
  (T-0007).
- **Vocab domain:** action verbs relevant to this learner's work — design, test, click,
  build, write, understand, go, read (~10 items, mixing regular and irregular to seed the
  irregular-verb awareness U05 will formalise).
- **Can-do:** describe a routine work action in the present tense with correct
  third-person agreement ("She tests the layout every sprint.").
- **Assessment sections:** R W
- **Sources:** cite by topic once owned.
- **Transfer notes:** Russian/Ukrainian fully conjugate every person, so the risk is
  UNDER-marking the one English form that stands out by being marked at all (VRB-3SG in
  `docs/mechanics/error_taxonomy.md`), not over-marking the others. (assumed)
- **Media:** text-first, same reason as U01.

## U03 — Reading short technical text; adjectives (A2)
status: pending
- **Grammar:** zero article with plurals/uncountables (T-0005); irregular plurals —
  mouse/mice, analysis/analyses (T-0008); regular comparison -er/-est (T-0017); irregular
  comparison good/better/best (T-0018).
- **Vocab domain:** descriptive adjectives from the design register — simple, accessible,
  consistent, responsive (~10 items).
- **Can-do:** skim (T-0026) one short, simplified technical passage and identify its topic
  and one supporting detail without translating word-by-word — the first concrete step
  toward goal scenario 1.
- **Assessment sections:** R
- **Sources:** cite by topic once owned; candidate register once material is acquired:
  short glossary entries from a design-system site (see `docs/reference/resources.md`).
- **Transfer notes:** reading strategy itself is not a language-specific skill and
  transfers from Russian/Ukrainian reading habits; what's new is tolerating the noise of
  unknown words in an English technical register without stopping to translate each one.
  (assumed)
- **Media:** text-first.

---

## Phase 2 — Writing at work; past tense; prepositions; questions (coarse — detail at phase entry)

## U04 — Writing short Slack-style messages (A2)
status: pending
- Register split between casual work-chat and formal writing (T-0024); composing a clear
  3-5 sentence message (T-0029). Serves goal scenario 3 directly. Sections: W.

## U05 — Past tense and irregular verbs (A2)
status: pending
- Regular past -ed (T-0011); irregular verb principal parts (T-0012) — the pack's
  `required_fact`, directly targets VRB-PRINPART. Serves scenarios 1, 3. Sections: R W.

## U06 — Prepositions, collocations, count/mass nouns (A2)
status: pending
- Verb+preposition collocations (T-0020); common preposition confusions (T-0021);
  count/mass noun mismatches — advice, information (T-0009). Serves scenarios 1, 2, 3.
  Sections: R W.

## U07 — Questions and negation (B1)
status: pending
- Do-support in negation (T-0015); subject-auxiliary inversion in questions (T-0016);
  adverb placement (T-0023). Serves scenario 3 (clarifying questions in work chat) and
  scenario 4. Sections: W L.

## U08 — Reading UX articles: register, scanning, summarizing (B1)
status: pending
- Periphrastic more/most (T-0019); technical/UX-article register (T-0025); scanning for
  specific facts in documentation (T-0027); summarizing an article's main argument
  (T-0028). Serves scenarios 1, 2 directly — this is the unit closest to the goal's
  reading scenarios in full. Sections: R.

---

## Phase 3 — Aspect, listening, spelling, consolidation (coarse — detail at phase entry)

## U09 — Present perfect and describing ongoing work (B1)
status: pending
- Present perfect vs past simple, the aspect-mapping gap named in transfer.md (T-0013);
  present/past continuous (T-0014). Serves scenario 3 (status updates). Sections: W.

## U10 — Listening to short work-call excerpts (B1)
status: pending
- Extracting key points from a short spoken excerpt (T-0031). The goal's explicitly
  secondary scenario 4 — one unit, not a strand, matching its lower priority. Sections: L.

## U11 — Spelling and vocabulary consolidation (B1)
status: pending
- Common irregular spelling patterns (T-0002); homophones/near-homographs (T-0003);
  spelling recall from dictation/memory (T-0030). Directly serves scenario 5, this
  learner's own stated weak point. Sections: W.

## U12 — Consolidation and scenario-run gate (B1)
status: pending
- Full scenario-run mock across reading, writing and listening (T-0032) — the goal's
  assessment instrument, run against all five scenarios. This is where the curriculum ends
  because it is where the goal contract says "done" begins: a clean pass here re-opens the
  next goal contract's scenario list rather than adding an eleventh scenario to this one.
  Sections: R W L.
