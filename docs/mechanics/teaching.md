<!-- mova:engine -->
# Teaching — the anatomy of a teaching block

> [session_format.md](session_format.md) governs the shape of a **session**. This file
> governs the shape of the **teaching inside part 2** — which had no rules until limba's
> first unit session produced material the learner called structureless, and correctly so.
>
> Added in limba, 2026-07-30, after SES-003 feedback. The three failures it exists to
> prevent: teaching the *delta* without ever teaching the *thing*; leaving the learner unable
> to tell whether a topic was exhausted; and showing the target language without translation.
>
> **Provenance** ([README.md](README.md)). Nearly all of this is **derived** rather than
> assumed — the beats and the chat/visual split from limba SES-003, the marking rule and the
> withdrawal of the `∅` glyph from 2026-08-07, the completeness rule below from SES-005. That
> is unusual here and it is why this file changes less often than it looks: each rule already
> cost something to learn. Incidents and Romanian examples are limba's, the reference
> implementation.

## The governing failure

A teaching block that opens with "here's what's different from your first language" is
useless to someone who does not yet have the map. **Establish the system, then the delta.**
The learner's transfer assets make the delta *interesting*; they do not make the system
*optional*.

## The eight beats — in order, every time

| # | Beat | What it does |
| --- | --- | --- |
| ① | **Placement** | Where this sits in its topic, what it exhausts, what's deferred and to which unit, which parts of the goal contract it serves |
| ② | **The whole system** | The complete inventory — table, paradigm, or rule set — *before* any contrast |
| ③ | **The load** | What must actually be memorised, and what follows automatically from it |
| ④ | **The delta** | What differs from the learner's held languages, ranked per the profile's `contrast_ranking`, grounded per [../reference/transfer.md](../reference/transfer.md) |
| ⑤ | **Worked examples** | 2–3, fully translated, with a one-line "what's happening" |
| ⑥ | **First contact only** | What was *named but not taught*, and the unit where it returns |
| ⑦ | **Guided attempt** | 2–3 low-stakes items with concealed answers — before anything graded |
| ⑧ | **The compressed rule** | One line to carry away |

**Beat ③ was added 2026-08-07, derived from limba SES-007** — where the learner asked the
question this beat exists to pre-empt: *"is there a pattern I need to know and look for or do
I just learn every verb?"* The answer — learn the infinitive plus the *eu*-form and the other
five forms derive, plus five never-break rules — became the most reusable thing on the page,
and it only got written because they asked.

It is **not** beat ⑧ in miniature. ⑧ compresses the *rule*; ③ compresses the **work**. A
six-verb paradigm table looks like thirty-six facts and is really six, and for an adult on a
deadline "one fact per verb, not six" is the motivationally decisive information. State the
irreducible load as a number where you can, and name what derives from it.

Beat ⑥ is not optional padding. It is what makes "complete" believable everywhere else: a
learner who can see the named gaps can trust the unnamed absences.

Beat ⑦ is the step whose absence made SES-003 read as reference material. Teaching is
explain → demonstrate → *attempt with feedback* → independent use. Part 3 of the session is
independent use; it is not the first attempt.

**Guided-attempt items follow the dulap pattern** — derived from limba's 2026-08-10 audit. Of
every attempt block then live, the one item that measured anything was `dulap`: a **novel
word** pushed through the taught procedure, its answer printed nowhere on the page. Most
others had their answers sitting in the tables directly above them — which makes them worked
examples wearing an attempt's clothes. Both kinds are legitimate; only the novel-item kind
may ever be scored, and the page should know which kind each item is. This is the
authoring-time half of the answer-leak rule in [session_format.md](session_format.md), which
governs scored sets.

## Where each beat lives — chat or the visual

Added in limba, 2026-07-31: SES-003 delivered every beat in **both** places, which is
duplication, not redundancy. Two facts decide the split.

**The transcript dies with the session.** The learner returns cold to a new chat, so nothing
they may need to re-read can exist only in chat. That pushes the material into the visual.

**A webpage cannot be interrupted.** SES-003's two interruptions — *"I don't get 2b"* and
*"you never establish what a fi is"* — both materially improved the material. That keeps
explanation in chat.

So split by function, not by importance:

| Beat | In chat | In the visual |
| --- | --- | --- |
| ① Placement | yes — the compact table | yes |
| ② The whole system | **name it and link — do not reproduce it** | **canonical, complete** |
| ③ The load | **yes, in full** — this is the reassuring half, say it out loud | yes, beside the table it shrinks |
| ④ The delta | **yes, in full** — the part worth talking through | yes |
| ⑤ Worked examples | 1–2 of them | all |
| ⑥ First contact only | yes — a short list | yes |
| ⑦ Guided attempt | link only | **only here** — reveal buttons need real HTML |
| ⑧ Compressed rule | yes | yes |

**The rule: chat never reproduces a full paradigm table.** Alphabets, conjugation tables,
pronoun grids, ending charts, coverage maps — these live in the visual; chat names what they
contain and links to it. Chat carries the contrast, the trap, and everything that responds to
the learner.

**Vocabulary follows the same split.** The 10–20 item table belongs in the visual, with audio
on every item (`data-tts`) — a word list is exactly the thing worth hearing and re-opening.
Chat surfaces only the items with a transfer story worth telling: the false friend, the
cognate that pays, the one that breaks a pattern.

**The test of a correct split:** someone who reads only the visual has the complete material;
someone who reads only chat has the interesting half and a working link. Neither has to
scroll a dead transcript.

## Mark what changes — beat ② is a pattern, not a list

**Gate: this whole section runs only when the pack declares `inflection: true`**
(`packs/<code>/pack.md`). A pack that declares no inflection skips this machinery — there is
no varying morpheme to mark, and forcing the treatment onto an isolating language would mark
nothing or mark noise.

Added in limba, 2026-08-07, at the learner's request, while working the plural endings: *"if
the endings were highlighted to see what is changed — would help me to see and understand the
pattern the most."*

A paradigm printed as plain text makes the learner do morpheme-segmentation in their head
before they can even see the rule. **The part that changes carries the lesson, so mark it.**

1. **Highlight the varying morpheme, leave the stem plain.** `prieten` → `prieten<b>i</b>`,
   `casă` → `cas<b>e</b>`, `vorbesc` → `vorb<b>esc</b>`, `oraș` → `oraș<b>ul</b>`. One
   consistent treatment across the whole page, reserved for this and nothing else.
2. **The pattern must be visible down the column, without reading.** If a table's marked
   segments don't line up into a shape the eye can follow, the table is ordered wrong —
   group by ending, not alphabetically.
3. **Contrast pairs get aligned, not just adjacent.** Singular above plural, one gender above
   another, so the difference sits in the same visual position on both rows.
4. **Do not mark a zero ending — leave the bare form bare.** Rule 3 already carries it: with
   `prieten` sitting directly above `prieten`<b>i</b>, the added ending is visible *because*
   the row above ends clean. An explicit `∅` was tried and withdrawn the same day at the
   learner's request (limba, 2026-08-07): it fired on every masculine and neuter singular in
   the table at once, and the noise cost more than the clarity bought. **Reserve the marking
   for something that is actually there.** If the absence of an ending is itself the lesson,
   say it in a sentence next to the table, not as a glyph inside it.
5. **Where a stem change accompanies the ending, mark it differently** — `oraș` → `oraș<b>e</b>`
   is one change, but `carte` → `cărț<b>i</b>` is two, and collapsing them into one colour
   teaches a rule that does not exist.
6. **For an alternation, the column that teaches is the *environment*, not the arrow**
   (limba, 2026-08-12). SES-008's noun sheet listed `oa → o` and `ea → e` as two rows of a
   shifts table. Re-deriving the same words one at a time showed they are **one conditioned
   rule with a single asymmetric cell** — `oa` stands before `a/ă/e`, `ea` only before `a/ă` —
   and that *calculatoare* gaining a diphthong and *ferestre* losing one are the same event
   seen from two starting points. As printed, the two rows read as a contradiction. A table of
   directed shifts is a **list of outcomes**: the learner cannot run it on a new word because
   the trigger was never named. This generalises past vowels — the same table gave `t → ț`
   without saying it fires only before `-i`.

Applies to every inflectional system the pack has: plural endings, article suffixes,
conjugation endings and infixes, case forms, agreement, comparatives. It is why the pages
exist rather than a chat table.

**Implementation**: the marking tokens and classes (`--mk`/`--mkBg`, `b.mk`, the stem-change
variant) are specified in [../visual/SPEC.md](../visual/SPEC.md). Keep the *same* class in
every visual so the marking means the same thing on every page. It must survive both themes —
check the dark one.

## Which way the material runs — explanation goes backwards, production goes forwards

Added in limba, 2026-08-12. The beats decide *what* is shown; nothing decided **which
direction it runs**, and the two directions are not interchangeable.

**Explanation starts from the finished form and justifies it. Production starts from the base
form with nothing else given.** A page built the first way can be completely correct, score
well on recognition, and transfer nothing.

The evidence is a matched pair over the same 14 nouns. limba's 2026-08-09 per-word sheet
derived all 14 plurals correctly and SES-009 measured **5/5** on the nouns it covered.
Production then failed on unrehearsed nouns for **three more sessions**, until SES-013 rebuilt
the same material as a forward procedure. The two index rows state the difference plainly: the
first *"reasons backwards from the answer"*, the second *"runs forwards from the singular."*

- **Anything the learner must produce gets built forwards**: start from what they will actually
  have in hand, name each step in the order they must run it, and end at the form.
- **Backwards material is for understanding *why*, and it is not a substitute.** It can follow a
  forward procedure; it cannot replace one.
- **A recognition score does not license a production claim.** They are two memories, not two
  views of one ([../reference/profile.md](../reference/profile.md)).

### Restating shipped material the other way round is a cheap defect-finder

limba's 2026-08-09 sheet's entire brief was to restate 14 words taught two days earlier. It
hit a contradiction in the source material **inside the first three cards**, and that
contradiction became the session's main output. Nobody was looking for it.

The workspace already sweeps artifacts for claims the docs have **retracted**. It has nothing
that re-reads live material for claims that were never coherent. A deliberate second pass over
a taught system, organised the other way round — **per word instead of per rule**, or forwards
where the original ran backwards — is cheap and has found real defects both times it happened
by accident. Worth choosing on purpose, at a review or before a system gets drilled hard.

## Placement — what beat ① must state

Every teaching block opens with a table answering four questions, sourced from
[../reference/topics.md](../reference/topics.md) — never improvised:

| Field | Example |
| --- | --- |
| **Topic** | The pronoun system — 8 sub-systems |
| **This section** | Subject pronouns: complete, 8 forms + formal address |
| **Coverage of the topic** | 1 of 8 |
| **Deferred** | reflexive → U06 · possessive → U04 · accusative → U13 · … |
| **Serves** | the goal contract's section letters, e.g. R · W · L · S |

Coverage labels are exactly three: **complete** · **partial (N of M)** · **first contact**.

### `complete` has to be earned — derived from limba SES-005

`complete` is the strongest claim this contract lets a session make, and beat ⑥ exists
precisely so the learner *trusts* it: someone who can see the named gaps is entitled to trust
the unnamed absences. Nothing checked it. A limba block claimed **"Numbers 0–100: complete —
every number in that range is derivable after this page"** while omitting *douăsprezece*, the
feminine twelve. The learner found it in minutes.

Note the failure shape, because it is the reason a rule is needed at all: **the material was
not wrong, it was short — and short is invisible to its author by construction.** You cannot
proofread your way out of it; you have to count.

1. **`complete` may only be claimed for an inventory that is enumerated and countable in the
   visual.** "All seven forms", "all five plural classes", "31 letters" — a number you can
   check. A system whose members cannot be listed gets **partial (N of M)** instead.
2. **Before writing the word, answer "what would make this incomplete?"** in one line, and
   look for that thing. Gender pairs, irregular members, the form that only appears in one
   register — the omission is almost always a *member of a set you enumerated too narrowly*.
3. **When unsure, claim less.** `partial (N of M)` costs the learner nothing; a false
   `complete` costs them the ability to trust every other label on every other page.
4. **Verify the inventory via the dictionary adapter before writing the label** — added in
   limba, 2026-08-10. `scripts/dictionary.mjs` is the interface, per
   [verification.md](verification.md); the pack's adapter attests gender, plural and
   conjugation from its named source, and
   [../reference/resources.md](../reference/resources.md) has the URL patterns for by-hand
   checks. **An instance on the null adapter cannot check, so it marks the claim unverified
   instead** (verification.md's `?` marker) — never silently asserts it. limba's audit found
   the claims that failed were exactly the unchecked ones.

### Absolutes have to be earned too — derived from limba's 2026-08-10 audit

`complete` is not the only overclaimable word. An audit of every live visual found the
failing claims concentrated in **absolutes**: *"-ă → feminine — no exceptions worth your
time at B1"* (tată, an early unit's first noun, is masculine); *"a plural in -uri is always
neuter"* (vremuri and treburi are feminine); *"a short closed set — learn it once"* (lapte
and castravete join the -e list two units later). Each returned a confident wrong answer for
a word already on the syllabus.

1. **Every *always / never / no exceptions / closed* claim names its exceptions or carries
   its scope** — "in this set", "at this level", "of the words you own". A scoped absolute
   is honest and still teaches; an unscoped one is a bet against the whole lexicon.
2. **Before writing one, answer "what breaks this?" and go look** — the breaker is almost
   always a common word in a unit a few weeks out. Check it via the adapter (rule 4 above).
3. **A rule that cannot be broken by any word is usually a betting rule** — say so on the
   page. limba's gender sheet's "default feminine, memorise the short masculine set" is the
   model: it names itself a bet, so a miss discredits the bet, not the page.

The **session** carries the same statement one level up: which unit of the curriculum, what
it opens or closes, what the learner will and will not be able to do afterwards.

## A correction sweeps the artifacts — derived from limba's 2026-08-10 audit

Reference docs get corrected; the visuals that teach the old claim do not correct
themselves. limba's audit found four instances live in the hub at once: a transfer anchor
fixed in transfer.md still absent from the sound pages a week later; a gender heuristic
rewritten as ordered gates while the noun page kept teaching the retracted wording verbatim;
a coverage count grown in topics.md while the pronoun page and this file's own example still
said the old number; and a retired word with ~25 survivors in the visuals. A stale claim in a
live visual costs more than no visual — the learner re-reads pages precisely because the
transcript dies.

**The rule: a session that corrects a claim, retires a wording, or supersedes a taught rule
greps `work/visuals/` and the `state/` notes for the old claim in the same session**, and
updates in place or marks the page superseded. The close-out is not done until the sweep
is. `scripts/visualcheck.mjs` backstops the retired wordings it can pattern-match; the
sweep covers everything it cannot.

## Hard rules

1. **Translation, always on first introduction.** Every target-language word, phrase, or
   sentence shown to the learner carries a meta-language translation the first time it
   appears — no exceptions, no phase cutoff. The word is "translation", not "gloss".
2. **After first introduction, translation follows the ledger.** Keep it while the item is
   **tier 1–2** in [../../state/vocab.md](../../state/vocab.md); drop it at **tier 3+**.
   Anything never in the ledger (function words, one-off examples) stays translated forever.
   This is derived from state, not judged case by case.
3. **No unestablished notation.** No term, marker, or form is used before it is taught. If
   it appears in a ledger row the learner has seen, it has been established — or it gets
   established now, in this block. (limba's `a fi` incident: the infinitive marker `a` was
   used for a week without ever being defined.)
4. **Systems before deltas.** Beat ② precedes beat ④. Always.
5. **Chat output is plain markdown.** No HTML — `<details>`/`<summary>` renders as raw tags
   in the learner's client. Concealed answers therefore live in the visual, not in chat.
6. **Run new material over the ledger rows it will be applied to, before it ships**
   (limba, 2026-08-12). **Five consecutive limba sessions found a defect in the workspace's
   own teaching material, and every one was found in use, by the learner, during the exercise
   it broke**: an absent conjugation table (SES-007); five unordered gender heuristics applied
   to the wrong words (ERR-013); a gender rule with **no exit for `-e`**, so *cheie* and
   *perete* had no correct path (ERR-016); a gate shipped in the morning producing a wrong
   answer for *nume* that afternoon, while *nume* sat in the day's queue (ERR-021); and a test
   that measured copying (SES-011). **All five would have been caught by running the rule over
   the words already in `state/`.** Nothing in the workflow inspected material before it was
   put in front of the learner — that is the gap this rule closes.
7. **Suspect the material first when a score collapses.** Five in a row is a process property,
   not a run of bad luck. The old default was to log a memory failure and move on, which is
   exactly what happened twice before SES-007 found the missing table.

## Media binding — not a separate concern

[media.md](media.md) decides the channel; this file decides that the channel is **chosen
deliberately in every block**. The two drifted apart once already in limba (a session used
the fallback TTS voice for an entire lesson because the two files disagreed), so:

8. **Every teaching block declares its channel.** System topics (paradigms, contrasts,
   coverage maps, decision flows) **must** produce or update a visual in `work/visuals/`
   — check that directory's index first and improve in place rather than forking a
   near-duplicate. Guided attempts (beat ⑦) go in the visual, where reveal buttons work.
9. **Every visual is surfaced in the response** — sent inline *and* named by its repo path.
   A visual the learner cannot reopen is a visual that does not exist.
10. **Audio is embedded, not commanded.** Visuals carry playable neural audio via
    `scripts/tts-embed.mjs` (when the profile's capabilities allow TTS — [media.md](media.md));
    the learner never needs a terminal to hear the language. There is no size budget — embed
    every target-language string worth hearing.

## Time

The block is **~30 minutes** ([session_format.md](session_format.md) part 2 — a default from
limba's learner). Eight beats plus 10–20 vocabulary items does not fit in less. System-heavy
topics may take a whole session for the grammar alone — that is expected, not a failure. Real
durations get measured over this learner's first sessions and the pacing table recalibrated
at a review ([playbooks/review.md](../../playbooks/review.md)), not guessed here.
