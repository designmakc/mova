<!-- mova:engine -->
---
verb: vocab
summary: Capture a word or phrase into the ledger - dedupe, enrich with the pack's required facts, append at tier 1.
triggers: add this word, what does this mean and keep it, save this vocabulary
requires: node, dictionary, git
scenarios: all
---

# vocab — ad-hoc capture into the ledger

Purpose: no encountered word gets lost. Anything worth keeping — from a podcast, a tutor
session, a sign, a question mid-conversation — enters the one ledger, properly enriched,
in under a minute.

**Reads**: state/vocab.md (dedupe + next ID), docs/reference/transfer.md (hooks),
docs/mechanics/srs.md (schema rules), the active pack (`packs/<code>/pack.md` — the
`genders:` labels and the `required_fact:` every relevant row must carry),
docs/mechanics/verification.md (how a fact earns its place).

**Writes**: one or more tier-1 rows in state/vocab.md, commit `vocab: +N <theme>`.

**Shared rituals — deliberately exempt, with one carve-out.** This is a capture, not a
session: it gets no `SES-NNN`, teaches nothing, and scores nothing, so the orient and
close-out rituals in
[docs/mechanics/session_format.md](../docs/mechanics/session_format.md) do not apply.
This is the one exemption in the workspace and it is reasoned, not an oversight. **But run
`date` first anyway** — every new row writes `added` and `last`, and a wrong date there
silently shifts the item's whole SRS schedule.

## Flow

1. **Normalize**: NFC, full diacritics, per the pack's normalization
   (`packs/<code>/normalize.mjs`); dictionary form with the pack's citation conventions
   (in limba's pack: nouns as singular + gender + plural in parentheses; verbs as
   `a `-infinitive). **The row must say what kind of word it is** — the pack's tag grammar
   (`packs/<code>/pos-tables.mjs`) decides what already says it (in limba's pack a gender
   means noun, a leading `a ` means verb) and which residue takes an explicit tag in the
   first slot of the parenthetical — limba's examples: `din (prep)`, `cine (interog)`,
   `bine (adv)`. `state/ledgers.test.ts` fails CI on a row that says nothing, and the deck
   cannot filter what it cannot type. Schema and tag rules:
   [docs/mechanics/srs.md](../docs/mechanics/srs.md).
2. **Dedupe**: grep the ledger for the bare headword. Hit → don't add; enrich the existing
   row's notes instead and say so.
3. **Enrich**: the meta-language translation; the pack's `required_fact:` where the word
   class demands one (limba's: the verb's eu-form) — **verified per
   [docs/mechanics/verification.md](../docs/mechanics/verification.md)**: through the
   pack's dictionary adapter, or tutor-confirmed, or visibly carrying the `?` marker; notes
   = the cheapest memory hook — a cognate in a held language, a meta-language mapping, a
   false-friend warning (check transfer.md; if this word IS a new false friend or pattern,
   append it to transfer.md too, same session).
4. **Append** with the next `V-` ID, `tier 1` (`tier 0` if the word runs ahead of the unit
   that will teach it — srs.md), `added = last = today`, and the `topic` aspect id it is
   scored under (srs.md's rule: the aspect it is scored under, not the one that will repair
   it). No `|` in cells.
5. If several words arrived at once (post-podcast dump), batch them in one commit. When a
   word's relevance to the goal contract is dubious, say so and let the user decide — the
   goal contract is the spec, but ad-hoc curiosity keeps motivation alive; the tie goes to
   adding.
