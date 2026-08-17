<!-- mova:engine -->
---
verb: retro
summary: Harvest what a session learned about the workspace itself - fix what has an obvious home, file the rest for housekeeping. Multi-writer by design.
triggers: retro, what did we learn, capture insights
requires: node, git
scenarios: all
---

# retro — turn a session's friction into a change

Purpose: a session notices things no document knows yet — a rule that misfired, a correction
the learner had to repeat, a convention that exists in one playbook out of seven. Those die
with the transcript unless something harvests them. This is that something.

Born out of limba's 2026-08-07 housekeeping pass, where five sessions audited themselves and
produced 34 findings. Most were things the session already knew at the time and had no place
to put. **The cost of not running this is measured in days:** in limba, a learner keyboard
preference sat in the error tally as a language error for five days, shaping what got
drilled.

**Reads**: this session's own history first. Then, to place a finding:
[docs/reference/profile.md](../docs/reference/profile.md), docs/mechanics/* **and
docs/mechanics/why/*** — a retro is one of the two readers of `why/`, and the rule alone
does not tell you whether a finding is new or a rule already bought and forgotten,
docs/reference/transfer.md, docs/logs/, `git status`, `git diff` — the last two twice over,
because they also tell you which sibling retros are mid-flight.

**Writes**: whichever files a finding actually belongs in (below), plus
`work/feedback/insights.md` via `scripts/feedback.sh` for anything structural.

## The judgment this playbook exists to make

Not "is this a good idea" — **"does this already have a home?"**

Findings with an obvious home get **fixed now**, in this session, per the repo's standing
convention that a discovery updates its file in the task that found it:

| Finding | Home | Act now |
| --- | --- | --- |
| A new transfer hook or false friend | `docs/reference/transfer.md` | yes — same session, always |
| A fact about how the learner works | `docs/reference/profile.md` | yes |
| A recurring error (3+) | `docs/logs/error_log.md` | yes, coded |
| A missing fact on a ledger row | `state/vocab.md` notes | yes |
| A wrong or stale line in a mechanic | that mechanic | yes, if the fix is unambiguous |
| A resource worth keeping | `docs/reference/resources.md` | yes |

**A finding about the engine rather than about this learner has a second home**, and the
intake is not it: `work/feedback/insights.md` is read by this workspace's own housekeeping
pass and by nobody upstream. A rule that misfired, a script that failed, a setup step that
generated something wrong — those are defects in the template every other instance was
copied from, and [feedback.md](feedback.md) is the only channel that carries them there.
File the local half here if this instance needs a workaround now, then offer the report.
Offer it once, in a sentence, and drop it if the answer is no.

Everything else — anything that changes a **rule**, trades one design against another, spans
several files, or that you are not confident enough to decide alone — goes to the intake
instead. **Do not fix a mechanic you are still arguing with yourself about.** A session in
the middle of the problem is the worst judge of a structural change to it; that is what the
housekeeping pass is for.

## Assume you are not the only retro running

**The normal case is several retros at once** — one per session tab, all started together
when the learner sweeps a day of work, all landing within the same few minutes. This is the
one command in the workspace that is deliberately **multi-writer**. AGENTS.md's "never two
learning sessions concurrently" does not apply to it: a retro takes no `SES-NNN`, reads no
queue and moves no tier. Everything below does apply.

Siblings are already visible in limba's record, the reference implementation. `FB-006`,
`FB-007`, `FB-012` and `FB-013` landed inside one minute from one session while `FB-011`
landed from another; `ERR-035` had to cross-reference `ERR-034` because a concurrent session
appended it mid-write; the intake jumps `FB-007` → `FB-011` because two writers numbered
from the same stale read. Expect company. It is not a fault, and it is not something to fix.

**Start by seeing who else is working:** `git status --short`, before you edit anything.
Every path already modified is a sibling's territory. Do not clean it, revert it, stash it
or commit it, and do not read a dirty tree as a broken workspace.

| Surface | Hazard | Rule |
| --- | --- | --- |
| `work/feedback/insights.md` | two appends, one silently lost | only ever `scripts/feedback.sh` — it locks. Never Edit/Write the file. Never a `## FB-` heading in your body: the script owns the ID and rejects a body that writes one |
| `docs/logs/error_log.md`, `session_log.md` | two entries take the same ID; CI enforces unique and strictly descending | re-read the file and derive the ID **in the same turn as the append** — use `scripts/log-append.mjs`. Never reuse a number you computed earlier in the retro. If a write is rejected as stale, re-read and re-number — never retry the same edit |
| `state/` ledgers | same as the logs | append the note fresh, re-reading the row immediately before you write it |
| Prose docs — `profile.md`, `transfer.md`, `docs/mechanics/*`, `docs/mechanics/why/*` | two retros reword the same paragraph | **grep the file for your fact first** — a sibling may have landed it two minutes ago. Add a bullet or a row; do not rewrite a paragraph. If the paragraph itself has to change and `git status` shows the file dirty with work that is not yours, file the finding to the intake instead of racing for it |
| Generated surfaces — `deck.html`, the hub, visuals | four retros regenerate and commit the same page | a retro does not regenerate them. That belongs to a study session's close-out |
| `git` | one commit sweeps a sibling's half-finished edit | commit **named paths only**. Never `git add -A`, `git add .`, or `git commit -a`. Never `stash`, `reset`, `restore` or `checkout --` — they destroy uncommitted work whose value you cannot see |
| `npm test` | red from a file a sibling is mid-edit | fix failures in **your** paths. A failure in a file you did not touch is a sibling mid-write: say so in the report, leave it alone |

**Where a finding's WORDS go, once you know which rule it changes.** A retro is the one
command that routinely adds both a rule and the story justifying it, and nothing has ever
removed either — which is precisely how the mechanics files doubled upstream. So:

- **The rule, and its marker, go in the rule file.** Keep it short enough to obey.
- **The incident, the numbers, the retraction go in `docs/mechanics/why/<file>.md`** — which
  carries no word budget, because it is the pressure valve. Capping it would push provenance
  back into the rule files or delete it.
- If `docs/consequential.test.ts` fails a rule file's budget, that is the signal to act, not a
  style complaint. It means one of two things: provenance crept back in (move it to `why/`), or
  the file genuinely gained rules (retire one, or split the topic).

Two more, both about effort that buys nothing:

- **Do not dedupe against your siblings.** Their intake blocks may be half-written, and
  whether two blocks say the same thing is triage's problem — the no-filtering rule exists so
  parallel retros can each report a finding without negotiating. Grepping the *target doc*
  before a fix-now edit is a different thing, and it is required.
- **`index.lock` means a sibling is mid-commit.** Wait a few seconds, retry. Never delete the
  lock file.

## Flow

1. **Orient, lightly.** Run `date`. Read
   [docs/reference/profile.md](../docs/reference/profile.md) — several findings turn out to
   be things already settled there, and re-litigating them is itself a failure mode. The
   full orient ritual does not apply: this is not a study session and takes no `SES-NNN`.
2. **Reconstruct the session.** What was asked, what you did, where it went sideways. Four
   things specifically:
   - **corrections** — anything the learner had to say twice, or correct you on;
   - **friction** — time spent on something that should have been free;
   - **dead ends** — what you tried that did not work, so nobody repeats it;
   - **surprises** — where the workspace did not behave the way its docs describe.
   If context was compacted, reconstruct from the session log entry, the error log, `git
   diff`, and the artifacts produced.
3. **Ask what the learner never said.** The strongest findings in limba's 2026-08-07 pass
   were not requests — they were things the sessions noticed themselves. A retro that only
   lists the learner's complaints has done half the job.
4. **Place each finding** per the placement table. Fix the placeable ones now and say what
   you changed — under the concurrency rules above: grep the target file before you add a
   fact, re-read immediately before you write, and defer rather than race for a paragraph a
   sibling is already holding.
5. **File the rest**: write each block to a scratch file, then

   ```
   scripts/feedback.sh "SES-NNN <type>" --file <scratch>.md
   ```

   The script takes a lock, so this is safe with other sessions running. Block shape is in
   the intake file's header. **Make the source label identify you** — `SES-016 retro
   (lesson)`, not `retro` — because several blocks land in the same minute and the label is
   all triage has to tell them apart. **Do not filter for novelty** — whether something is
   already half-implemented is the triage session's problem, and suppressing an observation
   because it looks handled is the one failure that loses it for good.
6. **Report** in plain language: what you fixed, what you filed, and — honestly — what you
   noticed but could not place. Name the paths you wrote, so the learner reading four retro
   reports at once can see who owns what. Then commit **only those paths, by name**:

   ```
   git add docs/reference/transfer.md docs/reference/profile.md
   git commit -m "retro SES-NNN: <one line>"
   ```

   Name the session you retro'd in the message — four `retro:` commits in one minute are
   unreadable otherwise (plain `retro: <one line>` when no session sits behind it).
   Workspace-improvement work stays out of `SES-NNN` commits.

## Scope

The workspace, not the language. How sessions run, how material is built, what the mechanics
say, what the tooling does, what the profile records. A target-language word that was hard
is a ledger note, not a retro finding — the exception being when it reveals something about
*how* material is being taught.
