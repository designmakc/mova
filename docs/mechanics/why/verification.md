<!-- mova:engine -->
# Why — verification.md

> The provenance of [../verification.md](../verification.md): the incidents and audits each
> rule was bought with. **A study session does not read this file.** `playbooks/retro.md` and
> the housekeeping pass read both, and new provenance is written here — not back into the
> rule file.
>
> The rule keeps its marker (*assumed* / *derived from …* / *measured*) where a session reads
> it; that tag is what tells a session whether it may question the rule. Only the story moves.

## Why this file exists

Moved out of the rule file's header (2026-09-08), verbatim:

The operator of a mova instance is typically learning the target language — which means they
*cannot* check the agent's claims about it. limba's operator could and did: the incidents
behind `teaching.md`'s completeness rules were all caught by a learner reading the material
critically. A template cannot assume that safety, so this file replaces it with a mechanical
one: every language fact the workspace writes down is **dictionary-verified**,
**tutor-confirmed**, or **visibly marked unverified**. Confidence is not a source.

## The marker on a page

Moved out of the rule file (2026-09-08), verbatim: two first-ever generated lesson pages
asserted ~60 and ~10 facts with no trail at all, 2026-08-15. The detail is in
`scripts/visualcheck.mjs`'s check 10: the Romanian page 15 genders, 15 plurals and 30 definite
forms under a pack with a working adapter; the German page ten phrases under a pack that ships
no dictionary, so every one of its facts was state 3 by construction. Zero markers, no source
note, both green.

## Why the ledger keeps eight columns

Moved out of the rule file (2026-09-08), verbatim: the 8-column ledger shape is a
sync-stability commitment. Instances update from this template for years; a ninth column would
strand every deployed ledger at the first `/update`.

## Teach time

Moved out of the rule file (2026-09-08), verbatim: limba's audit found the claims that failed
were exactly the unchecked ones.

## Input-method artifacts

Moved out of the rule file (2026-09-08), verbatim: limba's case: `ǎ ş ţ` produced by a legacy
keyboard layout for `ă ș ț`.

## Marking time, disputes, and the door line — the first completed study session (2026-08-24)

The first study session ever to run to completion on this engine was a Turkish instance under
ChatGPT's Codex agent, with no adapter but AGENTS.md's verb table: placement, a first-unit
repair lesson, close-out, commit. Turkish ships no pack, so the instance ran on a pack built at
setup and on the null adapter. The operator reported it on 2026-09-07, with the shared
transcript, after the learner said they would not use the workspace again: they did not trust
the model's grammar after what they had seen.

What they had seen. Placement item 13 asked what *geleceği zaman* meant in a sentence. The
learner read it as "before (it) comes". The standard account of `-(y)AcAğI zaman` is "when X is
about to" — the subordinate event still ahead of the main clause — so the reading was right. The
sheet scored it **Wrong target: geleceği zaman = when/at the time it will come, not before**.
The next message made that the headline repair item; the repair lesson's page taught it; the
checkpoint asked "does the time chunk mean *when* or *before*?" with *when* as the key. The
learner then wrote that the agent was wrong and stated the distinction. The reply opened "You
were right", patched the page, and listed four web sources afterward.

Not one of those marks or claims carried `?`. The rule in force said every language fact is
dictionary-verified, tutor-confirmed or visibly marked — and named capture time, teach time and
batch time as when checks run. It did not name marking. Nothing said what to do when the
learner contradicts a claim. And a clause's meaning is not a thing any dictionary adapter can
attest, so on that instance `?` was the only honest state available, and it was never used.

Three smaller things on the same sheet, each visible to a learner reading critically: the
agent's own item 11 was a sentence it later called "too muddy to score"; the learner said they
had read *Bakanın* as "the one who looks" (here it is "the minister's") and the sheet never
said so; *gazeteyi* was docked for "a newspaper" while *yazarın … kitabını* passed as "a
writer's book". And the flip lost a nuance the agent had right: its sheet had glossed
`-DIğI zaman` as "when, not necessarily after", which is the better statement; "you were right"
conceded the learner's narrower "after" along with everything else.

The learner's inference — wrong where I can check, so wrong where I can't — is the sentence at
the top of this file. The mechanism it describes existed and did not reach the two moments it
was needed. Three rules came out of it: marking is a checkpoint (`?` after the glyph, a
`Source:` line on every sheet, held by `work/sets/marked.test.ts`); a dispute is a check, not a
concession; and an instance on the null adapter says so at the door, not only on the hub.

What the rules do not buy, said plainly so nobody reads them as more: they do not lower the
model's error rate. A wrong mark the learner never disputes, on a point no source can check,
stays wrong — visibly unchecked. On a pack with no dictionary that is every grammar-meaning
mark, and the only route to attested is the tutor loop.
