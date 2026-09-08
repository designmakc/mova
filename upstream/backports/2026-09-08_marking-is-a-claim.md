<!-- mova:engine -->
# A mark against the learner is a language claim, and a dispute is a check

**Owed to limba.** Found in mova 0.19.0, from the first study session to run to completion on
the mova engine — a Turkish instance under ChatGPT's Codex agent, 2026-08-24. The story is in
mova's `docs/mechanics/why/verification.md`; this file is the part that belongs upstream.

## What happened

A placement item asked what *geleceği zaman* meant. The learner read it as "before (it)
comes", which is right (`-(y)AcAğI zaman` is "when X is about to"). The sheet scored it wrong,
the next lesson taught the wrong rule from a page, and when the learner objected the reply
opened "You were right" and listed sources afterward. No mark or claim carried an unverified
marker. The learner said they no longer trusted the model's grammar and stopped using the
workspace.

## What mova changed

- **Marking time joined the verification checkpoints.** A ❌ or 🟡 is a claim about the
  language and takes the same three states as a ledger row. A word's meaning or form goes
  through the dictionary before the sheet is published; what no dictionary can check — what a
  clause means — wears `?` after the glyph, and the sheet's last sentence invites a dispute.
  A `Source:` line at the foot carries the sheet's trail. A test (`work/sets/marked.test.ts`)
  fails a sheet that marks something wrong and carries neither `?` nor `Source:`.
- **A dispute is a check, not a concession.** Say the check, run it, report what it found and
  where, then re-score. Never open with the verdict. Where nothing can check it, keep the
  `?`, record both readings, report the item as disputed, hand it to the tutor list.
- **The null adapter speaks at the door**, not only on the hub. Probably not limba's case.

## Where it lands in limba

- `docs/mechanics/session_format.md` — the marked-sheet table (Status row, a new bullet),
  the correction policy ("the learner may correct you"), close-out step 6 (the sheet's name).
- `docs/mechanics/teaching.md` § Absolutes have to be earned — a ❌ on what a sentence means
  is an absolute about the learner's reading.
- limba's dictionary step (its own `dex.mjs` stage, where mova has verification.md) — marking
  time as a moment it runs.
- A test over `work/sets/` if limba keeps sheets there; mova's is deliberately crude and
  structural (a `Source:` line, `?` after a glyph), for the reason below.

## What is genuinely fixed, what is open, what is limba's to decide

**Fixed in mova**: the learner can always tell a checked mark from the agent's reading, and
pushback triggers a check instead of a reversal. **Not fixed, and not claimed**: the model's
error rate. A wrong mark nobody disputes, on a point no source can check, stays wrong —
visibly unchecked.

**Open, and the same in both repos**: the test cannot tell a grammar-meaning mark from a
spelling mark, so it asks for the sheet-level trail whenever anything is marked wrong and
trusts the rule for the per-mark `?`. A sharper check would parse the sheet's rows; mova
judged the sheets too varied for that (the same reason `sources.mjs` counts glyphs, not
tables).

**Limba's call**: limba's operator can check the agent's Romanian and has done so — the
incidents behind teaching.md's completeness rules were all caught that way. So the trail on
a sheet buys limba less than it buys a mova instance whose learner cannot check. The dispute
rule buys the same in both: an agent that yields to pushback cannot tell a right learner from a
wrong one, and limba's learner pushes back often. Whether the per-mark `?` is worth the noise
on a pack with a working dictionary, where most marks are attestable, is limba's to judge.
