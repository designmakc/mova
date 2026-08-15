<!-- mova:engine -->
---
verb: lesson
summary: Run today's full session - SRS review, new unit material, graded check, applied practice, close-out.
triggers: lesson, let's study, full session, shows up ready for a full study block
requires: node, audio, dictionary, git
scenarios: full
---

# lesson — the full five-part session

Purpose: one complete unit of progress along [docs/curriculum.md](../docs/curriculum.md),
run per the shared rules in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) (the five parts and
their order, time boxes, 60–70% calibration, correction policy) — read it, don't re-derive
it. **The steps below carry the mechanic's own part numbers**, so that "part 1 collapsed" or
"aimed at what part 3 missed" means the same thing in both files. Where this file and the
mechanic disagree, the mechanic wins and this file is the bug — the flow here listed
practice before the check, the **pre-swap** order, while the mechanic had already swapped
them and said why (found in the first generated lesson pages, 2026-08-15).

**Reads**: docs/reference/profile.md (every session, at orient), docs/plan.md (current
phase), docs/curriculum.md (current unit = first `status: pending`),
docs/reference/topics.md (**what this unit's material exhausts and what is deferred** — the
source for every placement statement), last SES entry's Next pointer,
`node scripts/queue.mjs`, docs/reference/transfer.md, docs/reference/resources.md,
docs/mechanics/* (**teaching.md** — the eight beats; media.md — when to play, draw, or
link), work/visuals/README.md (reusable visuals, **and pages already built but not yet
taught**).

**Writes**: state/vocab.md + state/grammar.md (tiers, `last`, new rows),
docs/reference/topics.md (`covered YYYY-MM-DD` on every aspect taught),
docs/logs/session_log.md (next SES-NNN), docs/logs/error_log.md (coded entries),
work/visuals/ + its README index, docs/curriculum.md (`status: covered YYYY-MM-DD` when the
unit's last session closes), git commit `SES-NNN: <summary>`. **A session that only builds
material writes a much shorter set** — see "Two ways this session ends" below.

**Shared rituals — run both in full.** The **orient ritual** and the **close-out ritual** in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) belong to every
session. The flow below is what happens *between* them.

## Flow

0. **Orient ritual** (session_format.md) — every step, silently. Then the lesson-specific
   part: current phase + unit, this unit's rows in topics.md, and the session's **placement
   announcement** — which unit of the curriculum's total, what it opens or closes, what the
   learner will and will not be able to do afterwards.
   **Then ask whether the placement calibration is still owed** — one command,
   `ls docs/snapshots/*_placement.md`. Nothing listed means this session probes instead of
   teaching: run it per session_format.md → **The placement calibration**, which also covers
   what to do when the learner would rather have a lesson today. Under `focus: full` the
   lesson verb is the carrier (`setup/scenarios/focus_modes.md`).
1. **SRS review (~10′)**: quiz due items **at the mode their tier calls for** — recognition
   (target→meta) at tier 1, bare production (meta→target) at tier 2, the **full package**
   (the headword plus every fact its row carries) as the tier-3 gate, recognition sweep at
   4–5 ([docs/mechanics/srs.md](../docs/mechanics/srs.md)). Grammar rows get one production
   sentence each. Promote/demote per the same file; a tier-3 miss needs the **split probe**
   (session_format.md) before you demote the row. Take the oldest items that fit the box and
   let the rest surface next session — session_format.md owns the box-versus-queue rule.
   **Read the score against session_format.md's Difficulty calibration table**, which has one
   row for a part-1 collapse, a different one for part 3, and a third for a second session the
   same day. Do not re-derive the band here. What it means in this flow: **< 50% and part 2
   gets cut hard or dropped**, with the reclaimed time going to a **repair loop** over the
   misses, and the number flagged for the review playbook as evidence about the intake, not
   about today's unit.
2. **New material (~30′)** — the current unit's vocab batch and 1 grammar point; volume,
   time box and the chat/visual split are the mechanic's (session_format.md's table,
   teaching.md's). Five steps, in order:
   1. **Compose the batch** — limba's default is 10–20 items, each carrying the pack's
      declared facts per `packs/<code>/pack.md` (limba's pack: gender + plural for nouns, the
      eu-form for verbs), one example, and a transfer hook from docs/reference/transfer.md.
   2. **Verify every fact at capture** —
      [docs/mechanics/verification.md](../docs/mechanics/verification.md). An instance on the
      null adapter marks the claim unverified; it never quietly asserts it.
   3. **Teach all eight beats, in order** —
      [docs/mechanics/teaching.md](../docs/mechanics/teaching.md): placement, whole system,
      **the load**, delta, worked examples, first-contact-only, guided attempt, compressed
      rule. System before delta, never the reverse; every target-language string translated
      into the meta-language on first appearance; full paradigms and the vocabulary list live
      in the visual, chat carries the contrast, the trap and the interaction — **chat never
      reproduces a paradigm table**. Generate fresh content; cite manuals, never reproduce
      them.
   4. **Earn beat ⑧ before you write it.** The compressed rule is the one line the learner
      keeps, and the page repeats it long after the chat dies — so it is the line most worth
      breaking on purpose first. Run teaching.md § **"Absolutes have to be earned too"** as an
      action, not as a reading: **name the class of words that breaks the rule you are about
      to write, check that class through `scripts/dictionary.mjs`** (verification.md), **then
      scope the rule to what survives — or drop it.** Both first generated lesson pages
      shipped a wrong compressed rule and neither had done this, with an adapter available in
      both: one taught that the feminine singular takes `-a` when feminine nouns in `-e` take
      `-ea` (`carte → cartea`), the other taught "when in doubt, add the article" for country
      names — backwards, and contradicted by its own exercise on the same page (found in the
      first generated lesson pages, 2026-08-15).
   5. **Play, draw, link** — honor the unit's `- **Media:**` bullet and
      [docs/mechanics/media.md](../docs/mechanics/media.md) (capability-gated): sound topics
      are *demonstrated* (`scripts/speak.sh` inline; registry links from
      docs/reference/resources.md for native confirmation), system topics get a generated or
      reused visual (`work/visuals/`, **index first** — a row opening `Built —` is material
      a previous session prepared and never taught) with **embedded playable audio**
      (`node scripts/tts-embed.mjs`), sent inline and named by repo path. After teaching a new
      sound, run 2–3 pronunciation round-trips (`scripts/pronounce.sh "<target>"`) — judge
      mismatches per media.md's honesty rules; repeat misses become pronunciation entries in
      the error log.
3. **Graded check (~10′)**: 10 questions across today's + due material, **sampling at least 3
   of the day's new words** (session_format.md owns that rule, the posing rules and the leak
   checks — write the answers out first and run `node scripts/leakcheck.mjs` on the set).
   For the **page**, the single gate is `node scripts/visualcheck.mjs <file>` — it runs
   the leak check itself and fails on HIGH, so a page is not finished until it exits 0.
   Score it, say the score plainly, publish the whole marked sheet. **It runs before
   practice**: the check measures what the teaching alone landed, uncontaminated.
4. **Applied practice (~15′)**: a short reading or guided dialogue in a format adjacent to the
   goal contract's assessment, **aimed at what part 3 just missed**, forcing today's new + due
   items into use. Correct per policy, code errors. This is targeted repair, not generic use —
   that is what the order buys.
5. **Close-out ritual (~5′)** (session_format.md) — every step: topics.md aspects flipped to
   `covered`, every visual indexed **with the date it reached the learner**, `work/` accounted
   for, the deck and the hub regenerated (`node scripts/deck.mjs`, `node scripts/hub.mjs`),
   the commit, and the plain-language summary. If this was the unit's last session, flip its
   curriculum status and run `npm test`.

## Two ways this session ends

- **Taught** — the close-out ritual, step 5. The default, and the only exit that may move a
  tier, flip a `covered`, or write an `SES-NNN`.
- **Built but not taught** — the session produced the material and **nothing reached the
  learner**: a request for a page rather than a session, the time gone, the learner never
  arrived. Take the **materials-prepared exit** (session_format.md) instead: index the page
  with **no Date** and `Built —` opening its Teaches cell, commit it, regenerate the hub so
  the learner can open it, and say in that row which unit it is for and where you stopped. **No ledger rows, no tier moves, no `covered`
  flips, no `SES-NNN`, no score** — nothing was taught and nothing was measured. Both first
  generated lesson pages ended exactly here and had no exit to take: the page stayed
  untracked and unreachable, and the unit stayed `pending` for the next session to build
  again (found in the first generated lesson pages, 2026-08-15).
