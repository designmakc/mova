<!-- mova:engine -->
# packs/_template/GENERATE.md — authoring a new language pack

> The playbook an agent follows to build `packs/<code>/` for a new target language.
> Contract: [../SPEC.md](../SPEC.md). Reference implementation: [../ro/](../ro/pack.md).
> The governing rule is the same as for teaching: **a language fact you cannot source is
> a language fact you mark unverified** — a pack is the one place a hallucination becomes
> curriculum, so this playbook is deliberately paranoid.

## Shape compliance is not compliance

The first agent-generated pack (German, 2026-08-15) followed every step of the old version
of this file and printed `packs/de: ok`. It shipped a normalizer whose look-alike map
mapped `ä` to `ä` — the identity function, under a pack.md advertising "ae→ä, oe→ö, ue→ü".
It declared `inflection: false` above a fixture file full of *Bücher*, *Männer*, *Häuser*.
It left `required_fact:` empty, which switched off the ledger guard on exactly the fact a
German learner must memorise per noun, and said nothing. It attached a Duden citation to an
endings list containing `-el`, which is not a German plural ending. Every one of those was
already forbidden in prose, and the model complied with the SHAPE of the instruction each
time.

So each step below ends in **SHOW** — a result you paste into the session before moving on.
Pasting "ran it, passed" is not showing. A step whose output you cannot produce is a step
that did not happen, and the honest move is to leave the key empty and say so.

Copy the skeleton files **from this directory**, never from `packs/ro/` — a copied
reference pack arrives with Romanian in it, and you will not notice all of it (two German
paradigm rows shipped the Romanian word *prezent*). Flip the ownership markers as you copy:
`<!-- mova:engine -->` → `<!-- mova:pack -->` in `.md`, `// mova:engine` → `// mova:pack`
in `.mjs`. Read `packs/ro/` for shape and for what a finished row looks like; retype every
fact from a source for your language.

## 1. Fill the manifest from stated facts only

`pack.md`: write the prose header (what the pack is, where its facts come from), then the
`mova-config` block. Every value comes from the human, a named reference, or a verifiable
source. `code:` must equal the directory name.

Two keys decide whether guards run, so decide them deliberately, not by default:

- **`inflection:`** — the only flag that deletes a required fixture (`golden/pairs.json`).
  `false` says the language has no form-marking worth teaching. Before writing `false`,
  look at the words you will put in `golden/words.json`: if any of them has a second form
  in its parenthetical that differs from the headword, the answer is `true`. packcheck
  cross-examines this against your own goldens and your own `endings` list.
- **`required_fact:`** — answer the question out loud: *what must this learner memorise per
  lexeme because no rule derives it?* Romanian verbs: the eu-form (conjugation class).
  German nouns: gender and plural. Mandarin: tone. It is the single highest-value habit the
  workspace can enforce on a ledger row. Empty is allowed only after you asked the question
  and the answer is genuinely "nothing" — and then you write that sentence in the prose.

Every key you leave empty must be **named in the prose** with what the pack loses by it.
packcheck fails an unjustified empty key; that rule exists because silence is how the guard
went missing.

**SHOW:** a table — one row per manifest key: `key | value | where it came from`. For voice
ids paste the matching lines from `edge-tts --list-voices | grep -i <lang>` and
`say -v '?' | grep -i <lang>`; if the tool is not installed, say that and leave the key
empty. For each empty key, one sentence naming the key and what is now unenforced.

## 2. Build the POS tables — source-or-unverified, per ROW

`pos-tables.mjs`: fill `TABLES` per the shape comments (canonical docs: `scripts/pos.mjs`
docblock).

- Start from how the LEDGER will say part of speech: which parenthetical tags exist, what
  each maps to. Gender letters map to `noun`; keep tags short and unambiguous.
- **A citation covers the rows it was checked against, not the block it sits above.** For
  each entry in `endings`, name two real words of the language it cuts correctly. An ending
  you cannot pair with two words comes out of the list — a missing ending degrades to a
  harmless stem-diff; a wrong one mis-marks every word it touches. (`-el` sat in the German
  list under a Duden citation. It is a singular ending: *Mantel*, *Löffel*.)
- `endings` is `[]` when the manifest says `inflection: false`. There is no third state:
  a list nothing runs is a guess nothing can catch.
- `verbHeadword` only if the language really marks infinitives in the citation form
  (ro: `a `); otherwise `null` and verbs take an explicit tag. **The docblock's reason must
  be true too** — the German pack wrote the right value (`null`) under a false explanation
  ("German infinitives are typically cited with `zu`"). Setup mines these files, and a
  wrong reason outlives a wrong value because the value gets run and the reason does not.
- No grammatical gender ⇒ `genders: []`, `article: {}`, and `inflection: false` in the
  manifest if there is no form-marking to teach.

**SHOW:** the `endings` list with its two attesting words per row, and the output of
classifying three real rows through the tables you just wrote:

```
node -e 'const {TABLES}=await import("./packs/<code>/pos-tables.mjs");
  const {createClassifier}=await import("./scripts/pos.mjs");
  const c=createClassifier(TABLES);
  for (const t of ["<a tagged noun>","<a tagged verb>","<an untagged bare word>"])
    console.log(JSON.stringify(t), "→", c.classify(t,"V-0001"));'
```

## 3. Build the golden fixtures — expectation first, then RUN it

`golden/` (format: [golden/README.md](golden/README.md), enforced by packcheck). The order
matters and is not negotiable: **write what the classifier SHOULD say from your source,
then run the classifier, then reconcile.** A disagreement means the tables are wrong — fix
the tables. Never edit an expectation to match the output; that is the circular reasoning
SPEC rule 3 forbids, and it proves the pack agrees with itself.

- `words.json`: ~30 REAL words spanning every facet in `types` (packcheck fails an
  unexercised facet), written exactly as ledger rows will write them, plus at least one
  untagged bare word with `expected: null`. Porting an existing classifier? Generate
  expectations by running IT — that is how `packs/ro/` proves behavior-identity with limba.
- `normalize.json`: four kinds, and label each one in its `note` — (a) one fixture per
  look-alike in your map, uppercase included, (b) an NFD-composition case, (c) an
  already-canonical identity case, (d) a missing-diacritic case that passes through
  unchanged. Kinds (a) and (b) are the ones a hollow pack skips: a set where every
  `input === expected` passes against `s => s` and packcheck now rejects it. If your map is
  empty because the language has no look-alikes, say that in the pack prose and claim no
  folding anywhere — packcheck runs every fold your prose advertises.
- `pairs.json` (required when `inflection: true`): ~15 real inflection pairs
  (dictionary-attested forms), including one identical pair and one stem-change pair. Run
  each through `markPair` and **eyeball every marked output**: `mk` must sit on the ending,
  `st` on the stem shift — if a fake stem change appears, fix the `endings` list, then
  freeze the output as `expected`.
- **Residue sweep.** If you looked at `packs/ro/golden/` at all, grep your fixtures for
  what came across: paradigm labels, tags, whole words. packcheck warns on shared
  vocabulary, but it only catches what is spelled identically. Read every row of your own
  file once, asking of each: is this word, this label, this paradigm from MY language, and
  is it complete? (`haben, prezent (habe, hat, haben, habt)` is wrong twice over — the
  label is Romanian and the 2sg *hast* is missing, so a conjugation error is frozen into
  the pack's behavior proof.)

**SHOW:** for `normalize.json`, one run proving a real fold —
`node -e 'const {normalize}=await import("./packs/<code>/normalize.mjs");
console.log(JSON.stringify(normalize("<look-alike input>")))'` — output must differ from
the input. For `words.json`, the reconciliation: any row where your source-derived
expectation and the classifier disagreed, and which table you changed to settle it. Say
"none" only if there were none.

## 4. Pass packcheck — warnings included

```
node scripts/packcheck.mjs <code>
```

Fix the pack until it exits 0. **Read the warnings** — they are the checks that cannot be
hard failures without breaking a legitimate pack, which makes them exactly the places a
hollow pack hides: uncovered look-alikes, a missing null fixture, an inert `requiredFact`,
reference-pack residue, `inflection: false` waiving `pairs.json`. CI runs the same check
for every pack; do not exclude your pack from it.

**SHOW:** the full command output, warnings and all, plus one line per warning saying
either what you fixed or why it stands.

## 5. Declare the dictionary honestly

If a machine-queryable dictionary exists for the language, implement `dictionary.mjs`
against the adapter contract in `scripts/dictionary.mjs` (network only inside `lookup()`,
honest User-Agent, timeout, `found:false` ≠ unreachable). **If none exists, do not fake
one**: leave the manifest's `dictionary:` empty and state in the pack prose that facts need
tutor confirmation or the unverified marker. packcheck deliberately never touches the
network, so it can neither confirm nor refute your adapter — test it by hand.

**SHOW:** the `node -e` lookup of two known words with their real output, or the prose
sentence declaring the pack has no dictionary.

## 6. Write notes.md — re-derived, not translated

`notes.md` is what a setup session mines to generate the instance's error taxonomy and
transfer file. Model it on [../ro/notes.md](../ro/notes.md) for STRUCTURE — error taxonomy
reference, resource registry, materials sources, grammar system inventory — and derive
every row from your language.

Every taxonomy example row shows a contrast: **the ✗ marks the wrong form, the correction
follows `→`, and the two are different strings.** packcheck lints this, because four rows
shipped where they were identical or the ✗ sat on the correct form, and two of them
propagated verbatim into a generated instance. Re-rank the codes for the learner's actual
held languages; drop a reference code their languages make irrelevant instead of porting
it.

**SHOW:** the taxonomy table, and for the three highest-traffic codes, the source or the
reasoning that earned each one for THIS language pair.

## 7. Audit your own prose

Read back every sentence you wrote in `pack.md`, the module docblocks and `notes.md`, and
strike anything you cannot source. Two shapes to hunt specifically:

- **Comparative claims.** "German has no article-based case marking like Romanian" is
  backwards on both languages. If a sentence compares the target to another language, it
  needs a source or it needs deleting — you are not being graded on the comparison.
- **Reasons attached to correct values.** Check each docblock's *because*, not just its
  *what*. A value that is right for a reason that is false will be copied forward by the
  next session, which trusts the reason.

**SHOW:** every claim you struck, and the sources for the comparative claims you kept.

## Sign-off

Only after all seven steps may a session claim the pack works. Paste this filled in:

```
pack: packs/<code>            packcheck: exit 0, N warnings (each addressed above)
inflection: <true|false>      because <the golden rows that decide it>
required_fact: <value|empty>  because <the per-lexeme fact, or why there is none>
empty manifest keys: <list>   each named in pack.md prose: <yes>
normalize: folds <N> look-alikes, proven by <the fixture where input !== expected>
goldens: derived from <source>; classifier disagreements resolved by <table change|none>
prose audit: <N> claims struck; comparative claims kept: <list with sources>
```
