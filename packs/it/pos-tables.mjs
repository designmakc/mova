// mova:pack
/**
 * Italian POS tables — the language half of scripts/pos.mjs for `packs/it`.
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
   * Endings, LONGEST FIRST. Italian pluralises by CHANGING the final vowel rather than
   * adding a suffix — `-o → -i`, `-a → -e`, `-e → -i` — which markPair shows as one clean
   * swap once both members are cut at that vowel.
   *
   * `he` and `hi` are here for the spelling-only `h` that keeps the hard consonant:
   * `amica/amiche`, `albergo/alberghi`. Without them the pair reads as a stem change, and
   * it is not one — the sound never moves, only the spelling defends it. The longer
   * `che/ghe/chi/ghi` were tried first and are WORSE: they cut `amiche` to `ami` while
   * `amica` cuts to `amic`, inventing a stem change out of the very thing this is here to
   * avoid.
   *
   * Genuinely irregular pairs are left to show as stem changes, correctly: `uomo/uomini`,
   * and the neuter-remnant class `uovo/uova`, `braccio/braccia`, which changes gender in
   * the plural and is a real thing a learner must see.
   */
  endings: ["he", "hi", "a", "e", "i", "o"],

  /**
   * The DEFINITE article. Italian's `il/lo/la` singular is the gender test a learner runs,
   * and the plural `i/gli/le` keeps the distinction — unlike French, which loses it.
   * The `lo/gli` allomorphs (before s+consonant, z, gn) are a spelling rule taught in the
   * curriculum, not a second gender.
   */
  article: {
    m: { sg: "il", pl: "i" },
    f: { sg: "la", pl: "le" },
  },

  /**
   * `null`. Italian infinitives end in -are/-ere/-ire and collide head-on with ordinary
   * nouns: `mare`, `padre`, `madre`, `sapere`, `piacere`, `avvenire`. Verb rows carry `(v)`.
   */
  verbHeadword: null,

  other: "word",

  /** `requiredFact` absent — see pack.md. Gender is the unpredictable fact and the row
   *  already carries it as the tag that makes it a noun. */

  trivial: [
    "il", "lo", "la", "i", "gli", "le", "un", "una", "di", "del", "e", "o", "a", "in",
    "che", "chi", "non", "si", "è", "per", "con", "da", "mi", "ti",
  ],
};
