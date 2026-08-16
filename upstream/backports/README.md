<!-- mova:engine -->
# upstream/backports — the reverse channel, written down

`playbooks/sync-upstream.md` § 6 says every fix that originates in mova and also belongs in
limba goes back as a commit in limba's own conventions, recorded there as a `PORT-NNN` entry
opening with **back-port** — so the next sync recognises it as already ported instead of
reading it as a local divergence.

This directory is where that statement waits between the two events. One file per change,
named `YYYY-MM-DD_<slug>.md`. **A file here is a debt, not a record**: delete it once limba
has taken the change and written its PORT entry, and name that PORT id in the deleting
commit.

Each statement carries: what changed and why, the limba paths it lands in, what is genuinely
fixed versus open, and what is deliberately left to the limba session to work out. **It is
context, not an implementation** — an over-specified statement caps the limba session at
mova's first guess instead of letting it find something better in its own repo.
