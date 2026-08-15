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
