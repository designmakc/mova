// mova:pack
/**
 * Romanian POS tables — the language half of limba's scripts/pos.mjs, restructured to the
 * shape documented in scripts/pos.mjs (the driver) and packs/SPEC.md.
 *
 * Behavior contract: `createClassifier(TABLES)` must be indistinguishable from limba's
 * classifier on real ledger rows — golden/words.json and golden/pairs.json were generated
 * by RUNNING limba's pos.mjs, and packcheck fails this pack the moment the split drifts.
 *
 * Every fact here is either taught A1–B1 material from the reference workspace or a
 * dexonline-checkable form; the endings list is deliberately NOT a complete morphology —
 * see the note on `endings` below.
 */

export const TABLES = {
  /** Facet order on the deck, and the word the learner reads on the chip. */
  types: [
    { key: "noun", label: "nouns" },
    { key: "verb", label: "verbs" },
    { key: "phrase", label: "phrases" },
    { key: "adj", label: "adjectives" },
    { key: "interog", label: "question words" },
    { key: "word", label: "other words" },
    { key: "pattern", label: "patterns" },
  ],

  /** Singular chip text — a row's own badge says "noun", not "nouns". */
  typeLabel: {
    noun: "noun",
    verb: "verb",
    phrase: "phrase",
    adj: "adjective",
    interog: "question word",
    word: "word",
    pattern: "pattern",
  },

  /**
   * Tags accepted in the parenthetical's first slot, and the facet each maps to.
   * A gender letter says noun by saying gender: `prieten (m, prieteni)`.
   */
  tags: {
    m: "noun", f: "noun", n: "noun",
    adj: "adj",
    v: "verb",
    interog: "interog",
    adv: "word", prep: "word", part: "word", interj: "word", conj: "word", num: "word",
  },

  /** The three genders, incl. the m-sg/f-pl neuter. Matches the manifest's `genders:` line. */
  genders: ["m", "f", "n"],

  /**
   * Endings this level actually teaches, longest first — the list decides where a form is
   * cut, so `lucru → lucr+u` and `lucruri → lucr+uri` land on the same stem and the pair
   * shows one clean ending swap instead of a fake stem change.
   * Source: limba docs/mechanics/srs.md + T-0010 (plural endings -i/-e/-uri, the -le class),
   * verified against the reference ledger's plurals via golden/pairs.json.
   */
  endings: ["uri", "ele", "ii", "ie", "le", "ă", "e", "i", "u", "a"],

  /** un/o for the singular, doi/două for the plural — the count is how gender is tested. */
  article: {
    m: { sg: "un", pl: "doi" },
    f: { sg: "o", pl: "două" },
    n: { sg: "un", pl: "două" },
  },

  /**
   * An untagged headword starting with the infinitive marker `a ` is a verb:
   * `a vorbi` needs no tag. (Verified rule; the marker drops when conjugated.)
   */
  verbHeadword: /^a\s+\S/,

  /** The residue facet — untagged one-word rows land here on the deck (and fail CI). */
  other: "word",

  /**
   * The manifest's `required_fact: eu-form`, made checkable: rows whose target matches
   * rowPattern (verbs, by the infinitive marker) must carry factPattern in notes — the
   * eu-form is Romanian's one unpredictable fact per verb (conjugation class shows only
   * in the first person). state/ledgers.test.ts enforces it.
   */
  requiredFact: {
    rowPattern: /^a\s+\S/,
    factPattern: /\beu\s+\S/,
    hint: "verb rows carry their eu-form in notes (e.g. `eu vorbesc`)",
  },

  /**
   * Function words too short and frequent to report as leaks on their own —
   * leakcheck.mjs still checks them as part of a full answer, never solo.
   */
  trivial: ["a", "o", "un", "de", "si", "in", "la", "pe", "mai", "e", "i"],
};
