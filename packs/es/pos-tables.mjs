// mova:pack
/**
 * Spanish POS tables — the language half of scripts/pos.mjs for `packs/es`.
 *
 * Shape contract: scripts/pos.mjs (the driver) and packs/SPEC.md. Modelled on packs/ro,
 * which is the reference implementation; every value below is a Spanish decision, not a
 * Romanian one carried over.
 *
 * Facts here are A1–B1 material, checkable against the pack's dictionary adapter
 * (en.wiktionary.org) or against any reference grammar. Where a table is deliberately
 * narrower than the language, the comment says so — an incomplete table that admits it
 * is honest; one that pretends to completeness is how a pack teaches a wrong absolute.
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
   * A gender letter says noun by saying gender: `casa (f, casas)`.
   */
  tags: {
    m: "noun", f: "noun",
    adj: "adj",
    v: "verb",
    interog: "interog",
    adv: "word", prep: "word", part: "word", interj: "word", conj: "word", num: "word",
    pron: "word",
  },

  /**
   * Two genders. Spanish has no neuter noun class — `lo` is a neuter ARTICLE used with
   * adjectives (`lo bueno`), and nouns it governs do not exist, so a third letter here
   * would invent a class the ledger could never fill. Matches the manifest's `genders:`.
   */
  genders: ["m", "f"],

  /**
   * Endings this level teaches, LONGEST FIRST — the list decides where a form is cut, so
   * that a singular and its plural land on the same stem and the pair shows one clean
   * ending swap instead of a fake stem change.
   *
   * Both members of a pair are cut, which is why the singular endings are here too:
   * `casa → cas+a` and `casas → cas+as` share the stem `cas`. Without `a` in the list the
   * singular would not be cut at all and the pair would read `casa → casa+s`, which hides
   * that the ending is what alternates.
   *
   * Deliberately NOT a complete morphology. Consonant-final nouns (`ciudad`, `lápiz`) are
   * cut at zero and their plural at `-es`, which is correct: `ciudad/ciudades` shows one
   * added ending, and `lápiz/lápices` correctly shows a stem change as well, because
   * z→c IS a stem change and the learner has to see it.
   */
  endings: ["es", "as", "os", "a", "e", "o", "s"],

  /**
   * The indefinite article in both numbers. Spanish marks gender in the article itself —
   * `un/una`, `unos/unas` — so the article pair is the gender test in both numbers, which
   * is what speech() reads it for.
   */
  article: {
    m: { sg: "un", pl: "unos" },
    f: { sg: "una", pl: "unas" },
  },

  /**
   * `null` — and this is a real Spanish constraint, not an omission.
   *
   * Romanian marks its infinitive with a free-standing `a` (`a vorbi`), so an untagged
   * headword can be recognised as a verb by shape alone. Spanish infinitives end in
   * -ar/-er/-ir and NOTHING distinguishes them from ordinary nouns with the same ending:
   * `mujer`, `mar`, `azúcar`, `pesar`, `deber`, `poder` are nouns or both. A regex here
   * would silently classify `mujer` as a verb.
   *
   * So Spanish verb rows carry an explicit `(v)` tag. The cost is one tag per verb row at
   * capture; the alternative is a classifier that is confidently wrong about common words.
   */
  verbHeadword: null,

  /** The residue facet — untagged one-word rows land here on the deck (and fail CI). */
  other: "word",

  /**
   * `requiredFact` is deliberately ABSENT, and the manifest's `required_fact:` is empty
   * to match. See pack.md — the short version is that Spanish's genuinely unpredictable
   * per-lexeme fact is the verb stem-change class (`pensar → pienso`, `poder → puedo`),
   * and `rowPattern` can only match the target string. With no infinitive marker, any
   * pattern wide enough to catch `pensar` also catches `mujer` and `lugar`, and would
   * demand a yo-form on nouns. An unenforceable guard declared as enforced is worse than
   * a guard the pack says out loud it does not have.
   */

  /**
   * Function words too short and frequent to report as leaks on their own —
   * leakcheck.mjs still checks them as part of a full answer, never solo.
   */
  trivial: [
    "el", "la", "los", "las", "un", "una", "de", "del", "al", "y", "o", "a", "en",
    "que", "se", "lo", "es", "no", "por", "con", "su", "me", "te", "le",
  ],
};
