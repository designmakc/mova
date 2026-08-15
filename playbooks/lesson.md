<!-- mova:engine -->
---
verb: lesson
summary: Run today's full session - SRS review, new unit material, applied practice, graded check, close-out.
triggers: lesson, let's study, full session, shows up ready for a full study block
requires: node, audio, dictionary, git
scenarios: full
---

# lesson — the full five-part session

Purpose: one complete unit of progress along [docs/curriculum.md](../docs/curriculum.md),
run per the shared rules in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) (time boxes,
60–70% calibration, correction policy) — read it, don't re-derive it.

**Reads**: docs/reference/profile.md (every session, at orient), docs/plan.md (current
phase), docs/curriculum.md (current unit = first `status: pending`),
docs/reference/topics.md (**what this unit's material exhausts and what is deferred** — the
source for every placement statement), last SES entry's Next pointer,
`node scripts/queue.mjs`, docs/reference/transfer.md, docs/reference/resources.md,
docs/mechanics/* (**teaching.md** — the eight beats; media.md — when to play, draw, or
link), work/visuals/README.md (reusable visuals).

**Writes**: state/vocab.md + state/grammar.md (tiers, `last`, new rows),
docs/reference/topics.md (`covered YYYY-MM-DD` on every aspect taught),
docs/logs/session_log.md (next SES-NNN), docs/logs/error_log.md (coded entries),
work/visuals/ + its README index, docs/curriculum.md (`status: covered YYYY-MM-DD` when the
unit's last session closes), git commit `SES-NNN: <summary>`.

**Shared rituals — run both in full.** The **orient ritual** and the **close-out ritual** in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) belong to every
session. The flow below is what happens *between* them.

## Flow

1. **Orient ritual** (session_format.md) — every step, silently. Then the lesson-specific
   part: current phase + unit, this unit's rows in topics.md, and the session's **placement**
   announcement — which unit of the curriculum's total, what it opens or closes, what the
   learner will and will not be able to do afterwards.
2. **SRS review (~10′)**: quiz due items **at the mode their tier calls for** — recognition
   (target→meta) at tier 1, bare production (meta→target) at tier 2, the **full package**
   (the headword plus every fact its row carries) as the tier-3 gate, recognition sweep at
   4–5 ([docs/mechanics/srs.md](../docs/mechanics/srs.md)). Grammar rows get one production
   sentence each. Promote/demote per the same file, and note that a tier-3 miss needs the
   split probe (session_format.md) before you demote the row. Take the oldest items that fit
   the box; the rest surface next session rather than being rushed.
   **If this scores < 50%, stop and re-plan the session**: retention of already-taught
   material has failed, so cut step 3's intake hard or drop it, and spend the time on a
   **repair loop** (session_format.md) over the misses. Teaching new material onto failed
   retention is how a backlog compounds. Flag it for the review playbook — it is evidence
   about the intake number, not about today's unit.
   **Unless this is the second session today** — then part 1 is re-exposure, carries no score
   and moves no tier, and this < 50% rule does not apply (srs.md, "Due when the row was
   already reviewed today").
3. **New material (~30′)**: from the current unit — a vocab batch (limba's default: 10–20
   items, each with the pack's declared facts per `packs/<code>/pack.md` — in limba's pack
   gender + plural for nouns, the eu-form for verbs — one example, and a transfer hook from
   transfer.md) and 1 grammar point. Verify facts at capture per
   [docs/mechanics/verification.md](../docs/mechanics/verification.md). **Built per
   [docs/mechanics/teaching.md](../docs/mechanics/teaching.md) — all eight beats, in order:
   placement, whole system, **the load** (what must be memorised and what follows from it),
   delta, worked examples, first-contact-only, guided attempt, compressed rule.** System
   before delta, never the reverse; every target-language string translated into the
   meta-language on first appearance. **Split chat/visual per teaching.md's table**: full
   paradigms and the vocabulary list live in the visual (audio on every item), chat carries
   the contrast, the trap, and the interaction — chat never reproduces a paradigm table.
   Generate fresh content; cite manuals, never reproduce them.
   Honor the unit's **Media** bullet and docs/mechanics/media.md (capability-gated): sound
   topics are *demonstrated* (`scripts/speak.sh` inline; registry links from
   docs/reference/resources.md for native confirmation), system topics get a generated or
   reused visual (`work/visuals/`, index first) with **embedded playable audio**
   (`node scripts/tts-embed.mjs`) — then send it inline and name its repo path. After
   teaching a new sound, run 2–3 pronunciation round-trips
   (`scripts/pronounce.sh "<target>"`) — judge mismatches per media.md's honesty rules;
   repeat misses become pronunciation entries in the error log.
4. **Applied practice (~15′)**: a short reading or guided dialogue in a format adjacent to
   the goal contract's assessment that forces today's new + due items into use. Correct per
   policy, code errors.
5. **Graded check (~10′)**: 10 questions across today's + due material. Score it, say the
   score plainly.
6. **Close-out ritual (~5′)** (session_format.md) — every step: topics.md aspects flipped to
   `covered`, every visual indexed, `work/` accounted for, the hub regenerated
   (`node scripts/hub.mjs`), the commit, and the plain-language summary. If this was the
   unit's last session, flip its curriculum status and run `npm test`.

**First run special case**: if the only snapshot in docs/snapshots/ is setup's intake one
(setup always writes it, so "no snapshot at all" would never fire), this session is the
**placement calibration** — probe across the curriculum's early units instead of teaching
(limba's placement probed the first half), write `docs/snapshots/YYYY-MM-DD_placement.md`
(with Method + "Not exercised:" per the snapshots README), and update plan.md's placement
milestone + pacing expectations at close-out.
