<!-- mova:engine -->
# docs/mechanics/ — the rules actually in force

**Conventions:**

- **Reality only.** A mechanic documented here is one the sessions actually run today — not
  a proposal, not an aspiration. Intent and design live in `docs/projects/`; when a design
  ships, its behavior moves here.
- **Playbooks are verbs, mechanics are nouns.** `playbooks/` orchestrate; the shared rules
  they all obey (SRS scheduling, session shape, error codes, fact verification) live here
  exactly once, so two playbooks never carry drifting copies.

  **A verb may restate a rule; it may not restate it without the pointer.** Added 2026-08-17
  on limba's evidence (its PORT-019). A verb that only said *"obey narration.md"* would put
  the rule out of reach at the moment of action, so paraphrase at the call site is required,
  not merely tolerated. What a paraphrase does badly is drop the half it did not quote, and
  it does that silently: limba's lesson skill carried one word of a two-default section —
  *"silently"* — which was the opposite of what the same section's last paragraph asked for,
  and a learner sat through fifteen minutes of unexplained silence. **So every restatement
  carries `§ N` back to the section it came from**, and a section holding two opposite
  defaults is never cited by one of them alone. Generated shims are the stricter case: they
  carry pointers and no rules at all, enforced by `docs/agents.test.ts`.
- **A rule file holds rules; `why/` holds the story.** Ported from limba, 2026-08-15. Every
  rule here was written with the incident that produced it attached, which is right — a rule
  that has lost its reason is a rule nobody can argue with. But the reason is needed only when
  *changing* the rule, while the rule is read by *every session*. Upstream, `session_format.md`
  grew 401 → 7,250 words in sixteen days, 68% of it in paragraphs citing a date or a log ID,
  and every session paid that read. So the story moved to `why/<file>.md`, paragraph for
  paragraph, **verbatim** — nothing was deleted or summarised. Study sessions read the rule
  file. `playbooks/retro.md` and the housekeeping pass read both, and **new provenance is
  written to `why/`**, which is why that directory carries no word budget and the rule files do
  (`docs/consequential.test.ts`).

  **The marker stays with the rule; only the story moves.** A rule keeps its *assumed* /
  *derived from SES-NNN* / *measured* / *default* tag where a session reads it — that tag is
  what tells a session whether it may question the rule, and it is worth four words. What moves
  to `why/` is the incident, the numbers and the retraction behind the tag.

- **Update in the same session that changes the mechanic.** If a session changes how reviews
  are scheduled or adds an error code, the matching file here changes in that same session.
- **Every rule states its provenance.** Added in limba, 2026-08-07. A rule that was *guessed
  at scaffold* and a rule that was *measured* read identically otherwise, and a session
  cannot tell which it may reasonably question. limba's `session_format.md` said "Time boxes
  flex; the order doesn't" with the same finality as anything derived from evidence — and
  that order was assumed, and was wrong: running the graded check before practice measurably
  improved retention. Compare `srs.md`, which said its intervals were *provisional pending
  real data*; that marker is exactly why a later session felt licensed to fix the ladder
  rather than working around it.

  Four values, on the section or the rule:

  | Marker | Means | A session may |
  | --- | --- | --- |
  | **assumed** *(at scaffold, or when added)* | someone's best guess, never tested | question it, and should say so when evidence appears |
  | **derived from SES-NNN** | changed in response to something that happened | question it with new evidence of the same kind |
  | **measured** *(date + what was measured)* | there is a number behind it | not overturn it on intuition alone |
  | **default** *(measured on limba's learner — recalibrate)* | imported from the reference learner this engine was extracted from — a real number, taken on one learner (limba's: a Ukrainian speaker with a measured 5× recognition/production split), not on this one | treat it as the starting point, never as fact about this learner; the review playbook (`playbooks/review.md`) re-fits it once ~10 sessions of this learner's own data exist |

  Absent marker = **assumed**. That default is deliberate: most of this machinery was written
  before it had any data, and pretending otherwise is how a guess acquires authority. The
  fourth marker exists for the same reason at one remove: shipping limba's numbers unlabeled
  would ship one learner's psychology as fact.

  Incidents cited as `SES-NNN` / `ERR-NNN` throughout these files are limba's — the reference
  implementation this engine was extracted from. They stay because each rule carries the cost
  of not following it. Do not invent new ones; this learner's incidents cite this instance's
  own logs.

| File | Owns |
| --- | --- |
| [srs.md](srs.md) | Ledger schemas, tiers, intervals, promotion rules |
| [session_format.md](session_format.md) | The five-part session, calibration target, close-out ritual |
| [teaching.md](teaching.md) | The eight beats, chat/visual split, marking, completeness and claim discipline |
| [media.md](media.md) | When to play, draw, or link; TTS voices; visual delivery |
| [narration.md](narration.md) | What the agent says while it works — pricing, silences, checkpoints, the learner's vocabulary |
| [verification.md](verification.md) | The fact-verification policy — dictionary-verified, tutor-confirmed, or visibly marked |
| [why/](why/) | The provenance of the rules — incidents, measurements, retractions. **Not read at orient.** |
| `error_taxonomy.md` | Error codes and log-entry format — generated at setup from `setup/templates/error_taxonomy.template.md` for this learner's language pair; instance-owned, engine-shaped |
