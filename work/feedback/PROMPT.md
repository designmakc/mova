<!-- mova:engine -->
# The prompt to post into each prior session

Copy everything below the line. Post it to every session that has worked on this
workspace — they can all run at once.

---

This is a housekeeping pass over this learning workspace. A separate session is collecting
feedback from every session that has ever worked on this repo, and will triage all of it
afterwards and decide what actually changes. Your job here is only to contribute what
*this* session learned.

**Scope.** Insights about how the workspace *works* — mechanics (SRS, session format, the
teaching contract, error taxonomy), the playbooks, the docs structure, the tooling and
scripts, curriculum sequencing, the learner profile and how it gets captured. Not
individual target-language words or one-off corrections; those already live in the ledgers.

**What to do:**

1. Re-read this entire session. What was asked, what you did, where it went sideways,
   what the learner had to correct or repeat, what they asked for explicitly, what they
   pushed back on. If your context has been summarized, reconstruct from what you still
   have plus the repo's own record of this session: its entry in
   `docs/logs/session_log.md`, `docs/logs/error_log.md`, the git commits, and any
   artifacts you produced.
2. Write insights from two sources, both required if you have them: **(a)** grounded
   directly in something the learner asked for or corrected, **(b)** something *you*
   noticed was worth improving that they never mentioned.
3. **Do not filter for novelty or feasibility.** Whether it is already implemented,
   half-implemented, or contradicts what another session is about to say is the triage
   session's problem, not yours. The only thing that permanently loses information is you
   deciding an observation isn't worth writing down.

**Quality bar.** Every insight needs a concrete moment behind it — something that actually
happened in this session, quoted where you can. An insight that could have been written
without having been here is not worth appending. Typically 3–6 of them; fewer if the
session was short, more if it earned them.

**How to append — read this, the file is shared.**

Several sessions are doing this right now, all writing to `work/feedback/insights.md`
(or the dated cycle file this pass names instead). Editor-tool writes silently drop
whichever block lands second, so appends go through a lock script instead:

1. Read the **header** of the target file (everything above the `---`) for the block
   shape. Don't read the other sessions' blocks — write yours from your own evidence.
2. Draft your block to a scratch file outside the repo.
3. Append it with:

```bash
scripts/feedback.sh "<source label>" --file <your scratch file>
```

(Set `MOVA_FEEDBACK_FILE` to reach a dated cycle file instead of the open intake.)

Source label: the session's `SES-NNN` and type if it has one (`SES-004 lesson`), or a
short description if it was infra work (`media layer + TTS`).

**Boundaries — you are one of several concurrent sessions.**

- You own only the block you append. Never edit another block, the file header, or any
  other file in the repo.
- **Do not commit.** Every session shares this working tree and would race on the git
  index; the housekeeping session commits everything at the end.
- Don't run other playbooks, don't touch `state/` or `docs/`, don't start a lesson.
- When the append succeeds, tell me in a few lines what you contributed, then stop.
