<!-- mova:template -->
<!--
  GENERATES: docs/reference/transfer.md — the language-pair contrast map every
  explanation draws on.
  RULES FOR THE GENERATING AGENT:
  - Change the marker above to `mova:instance`; delete guidance comments; fill every
    {{PLACEHOLDER}}.
  - EVERY CLAIM IS BORN `(assumed)`. You are generating this from the pack's notes.md
    plus your own knowledge of the language pair — that is exactly the kind of claim
    docs/mechanics/verification.md exists for. A row earns `measured YYYY-MM-DD` only
    from a real probe or session incident; setup measures nothing. limba's cost of
    skipping this: an asserted "no anchor for ă" row hid a real Russian anchor for
    three sessions — a missing teaching hook is the most expensive error because
    nothing surfaces it.
  - THE SECTIONS BELOW ARE MANDATED — all five, in this order, even when one is thin
    for the pair (say so in the section rather than dropping it).
  - FALSE FRIENDS — ≥10 rows is a FLOOR, not a target, and there is no ceiling: a close
    pair generates dozens (Italian→Romanian wants roughly forty). What earns a row, and
    what earns a place at the TOP of the table, is the same rule — traffic × cost.
    Traffic: the learner meets this word in the first weeks. Cost: the wrong reading
    changes what the sentence means, rather than merely sounding foreign. Order the table
    by that product — the first ten must be the ten you would keep if you could keep only
    ten, and a top ten of rare words is a mis-ranked table however long the tail below it
    is. Cross-language and target-internal confusables compete for the same slots on the
    same rule. If you cannot find 10 for the pair, the pair knowledge is too thin to
    generate from — say so and mark the table as needing tutor input. (Found generating an
    Italian-native vocabulary-only instance, 2026-08-15: it had forty rows worth keeping
    and no rule for which ten mattered.)
  - Draw on packs/{{PACK_CODE}}/notes.md first (earned facts), then pair knowledge.
    Rank contrasts per the profile's contrast_ranking, and write hooks against the
    languages the learner actually holds — a hook in a language they don't have is
    decoration.
-->
# Transfer map — {{HELD_LANGUAGES}} → {{TARGET_LANGUAGE}}

> The learner's unfair advantages, catalogued — and the traps where those advantages
> lie. **Living doc**: a session that surfaces a new transfer pattern or false friend
> appends it here in the same session.
>
> Contrast policy: ranking and the never-stack rule live in
> [profile.md](profile.md) — this file is the pattern inventory, not the policy.
>
> **Measured or asserted — mark it.** Every row here is `(assumed)` at generation. A
> tested row carries `measured YYYY-MM-DD` and says how; before building a teaching
> hook on a row, check which kind it is. A cognate **resembles** or **matches** — it is
> never "free": limba measured that resemblance alone does not make a word surface.
>
> **Alignment is a finding — in every section, not only Register.** Where the pair's
> systems match, say so in one line and name what it buys the learner: an alignment nobody
> is told about is an advantage nobody uses, and on a close pair most of this map is
> alignments. The guard stands: an alignment line must name **what transfers and where it
> stops**. "These two are basically the same" with no boundary is the section skipped, not
> the section written — and on a close pair that boundary is the entire teaching value.
> This binds appends too, not just generation. (Found generating an Italian-native
> vocabulary-only instance, 2026-08-15, whose Morphology and Syntax sections were mostly
> alignments and had no licence to say so.)

## Script & phonology

<!-- The writing system delta and the sound inventory delta: characters/sounds the
     learner's languages lack, sounds that map cleanly, the anchor for each hard sound
     drawn from the highest-ranked language that has it. Table or bullets. -->

{{CONTENT}} (assumed)

## Morphology traps

<!-- Where the target's word-building defies the held languages' instincts: categories
     that don't exist for the learner (articles for Slavic speakers), categories that
     exist but surface differently, inflection the learner will over- or under-apply.
     Name the interference direction per trap — corrections must cite it. -->

{{CONTENT}} (assumed)

## Syntax order

<!-- Word-order and clause-structure deltas: default order, clitic/particle placement,
     question formation, negation, anything the learner will calque wrong. -->

{{CONTENT}} (assumed)

## False friends

<!-- ≥10 rows as a floor, no ceiling, ordered by traffic × cost (see the rules above).
     Cross-language AND target-internal confusables both belong. The last column names
     the trap in one line. All (assumed) until a session catches one in the wild — then
     it gets its incident citation. -->

| {{TARGET}} word | Looks/sounds like | Actually means | The trap |
| --- | --- | --- | --- |
| {{ROW}} | | | (assumed) |

## Register & politeness

<!-- The formality system vs the learner's: T/V distinctions, honorifics, register
     markers the goal's assessment grades. If the pair's systems align, one line saying
     so with its boundary — the file's alignment rule, which holds in all five sections
     alike, not a permission special to this one. -->

{{CONTENT}} (assumed)
