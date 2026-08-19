<!-- mova:engine -->
# Why — media.md

> The provenance of [../media.md](../media.md): the incidents, audits and measurements each rule
> was bought with. **A study session does not read this file.** `playbooks/retro.md` and the
> housekeeping pass read both, and new provenance is written here — not back into the rule file.
>
> The rule keeps its marker (*assumed* / *derived from …* / *measured*) where a session reads
> it; that tag is what tells a session whether it may question the rule. Only the story moves.
> Nothing here was summarised: every paragraph was moved verbatim.

## The visuals index row

   **It moved from close-out to build time (2026-08-15)** because close-out is the wrong
   moment for both halves of the job. The index row is what stops a *concurrent* session
   rebuilding the same page, and a session can run for an hour after the page exists — the
   window where the page is real and unfindable is exactly the window that costs duplicated
   work. And the hub is the learner's one bookmark: a page they were told about but cannot
   open from it is, to them, not there yet. Regenerating twice costs one command; the hub is
   generated from repo files and overwritten, never merged (rule 5), so an extra generation
   can only make it fresher. Close-out then **re-runs it** over ledgers the session moved,
   and confirms the row (session_format.md, close-out steps 7 and 9).

## Why audio is embedded, not commanded

Added in limba (SES-003 / 2026-07-30): a `speak.sh` command printed in chat is gone the
moment the conversation scrolls, and a visual that tells the learner to open Terminal has
outsourced its own job. **Visuals carry their audio** (when the profile has TTS at all — a
`tts: none` instance leans on the registry's native links instead, and its pages say so).

## Why a view of moving state must be regenerated

limba's first-unit deck hardcoded its tier and miss tags into the HTML. It began lying about
the learner's state within a day of being written, because the ledgers behind it moved and the
page could not. That is the whole case for generating every page that states a number.

## Why the index row carries the delivery date (2026-08-12)

A page built outside a numbered session leaves no other trace. limba SES-009 credited a
recovery to an unlogged side session and had to dig through `git log` to work out which
artifact it meant.

## Why a repo path is not a link (2026-08-15)

Found in the first real onboarding run. A path *alone* asks the learner to open a file manager
and go find the thing that was just made for them, and the first principle of this workspace is
that they are not an operator. An attachment on its own fails differently and just as badly: it
arrives as a *download* showing HTML source instead of a rendered page, which is the failure
that started the rule (limba SES-004, 2026-07-31).

## Why the index row was added at all (SES-006, 2026-08-03)

The delivery record lived only in a chat transcript and died with it three times running.

## Why the Teaches cell needed a cap (2026-08-19, measured — ported from limba PORT-025)

The cell is rendered verbatim as the page's description on the hub, so its length **is** the
card's length — and it inflated 25× in three weeks: 133 characters on 2026-07-31, 3,786 on
2026-08-17. One card in a unit's grid ran several screens tall and the board around it could
not be read. Nothing had capped it because nothing had noticed the cell doing two jobs: a
learner-facing description and an agent-facing build report. The fix keeps both jobs, in two
places — one sentence on the card, the full prose kept verbatim below the table where nothing
renders it.

The cap was first set at 160 and tightened to 120 the same day, once the cards were seen
rendered: 160 passed the test and still cut mid-word, because the clamp is three lines and
three lines is about 120 characters at the card's width. **A length rule guarding a clamped
element must be derived from the clamp**, or the gate goes green on a broken artifact.

Checked before shipping that the un-dated form was right: with a date gate in place a
deliberately over-length row passed, because every existing row had been rewritten in the same
pass and the gate exempted all of them.

## Why the index table is read in full (limba SES-009, 2026-08-09)

The session read the first N lines of `work/visuals/README.md`, got the conventions and almost
none of the rows, and missed a visual built for the same 14 nouns hours earlier. It ran the
whole session without opening that page, then briefly mistook the file for another session
writing concurrently. Two costs in one slip: the reuse rule silently did not run, and a correct
repo state looked like a collision.

## Why ad-hoc greps do not verify a page (limba, 2026-08-12)

Two throwaway patterns gave two wrong answers in a row — an HTML comment read as an unclosed
tag, and a player-block count inflated by a line that merely mentioned the class — each briefly
convincing. A pattern written in the moment has no test behind it.

