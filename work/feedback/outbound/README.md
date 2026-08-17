<!-- mova:engine -->
# work/feedback/outbound — reports that left this machine

One file per report, `YYYY-MM-DD_<slug>.md`, written by
[playbooks/feedback.md](../../../playbooks/feedback.md). Each file is the **exact payload**
the learner approved, plus the issue URL when one came back.

Two reasons it is kept rather than sent and forgotten:

- **So the same defect is not reported twice** from one instance — the verb reads this
  directory before drafting.
- **So the learner keeps a copy of what they sent.** A report they cannot re-read after the
  fact is a report they agreed to blind.

A file here means *approved and sent*. A finding that was drafted and declined stays here
too, with `sent: no` in its header — the decision is part of the record, and it stops a
later session from re-asking a question the learner already answered.

Nothing in this directory is read by any other verb, and deleting it costs only the
duplicate-report guard.
