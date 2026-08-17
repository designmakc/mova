// mova:pack
/**
 * Portuguese POS tables — the language half of scripts/pos.mjs for `packs/pt`.
 * Shape contract: scripts/pos.mjs and packs/SPEC.md.
 */

export const TABLES = {
  types: [
    { key: "noun", label: "nouns" },
    { key: "verb", label: "verbs" },
    { key: "phrase", label: "phrases" },
    { key: "adj", label: "adjectives" },
    { key: "interog", label: "question words" },
    { key: "word", label: "other words" },
    { key: "pattern", label: "patterns" },
  ],

  typeLabel: {
    noun: "noun", verb: "verb", phrase: "phrase", adj: "adjective",
    interog: "question word", word: "word", pattern: "pattern",
  },

  tags: {
    m: "noun", f: "noun",
    adj: "adj",
    v: "verb",
    interog: "interog",
    adv: "word", prep: "word", part: "word", interj: "word", conj: "word", num: "word",
    pron: "word",
  },

  /** Two genders. Matches the manifest's `genders:`. */
  genders: ["m", "f"],

  /**
   * Endings, LONGEST FIRST. Portuguese plurals are mostly `-s`, but the language has one
   * class that defeats every simple rule and is the single most reliable source of learner
   * error, so this list is built around it:
   *
   *   **`-ão` splits three ways, per lexeme, unpredictably.**
   *     mão → mãos      (`ãos`)
   *     pão → pães      (`ães`)
   *     limão → limões  (`ões`)
   *
   * Cutting both members at these endings makes the pair show one clean swap — `pã|o →
   * pã|es` — instead of a fabricated stem change, and puts the three classes side by side
   * where a learner can see that only memory tells them apart.
   *
   * `el → éis` (papel/papéis) is here for the same reason: the accent appears because the
   * stress must stay put, and that is worth one clean colour rather than two.
   *
   * `res` was tried and removed: it cut `flor` at its own `r` and turned `flor/flores`
   * into a stem change. Plain `es` handles that pair correctly.
   */
  endings: ["ãos", "ões", "ães", "éis", "ais", "óis", "ão", "es", "os", "as", "el", "s", "a", "e", "o"],

  /** The indefinite article, which marks gender in both numbers. */
  article: {
    m: { sg: "um", pl: "uns" },
    f: { sg: "uma", pl: "umas" },
  },

  /**
   * `null`. Portuguese infinitives end in -ar/-er/-ir and collide with ordinary nouns:
   * `mulher`, `lugar`, `mar`, `prazer`, `poder`. Verb rows carry `(v)`.
   */
  verbHeadword: null,

  other: "word",

  /** `requiredFact` absent — see pack.md. */

  trivial: [
    "o", "a", "os", "as", "um", "uma", "de", "do", "da", "e", "ou", "em", "no", "na",
    "que", "não", "se", "é", "por", "com", "para", "eu", "você", "me",
  ],
};
