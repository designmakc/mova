// mova:pack
/**
 * French POS tables — the language half of scripts/pos.mjs for `packs/fr`.
 *
 * Shape contract: scripts/pos.mjs (the driver) and packs/SPEC.md. Facts are A1–B1 French,
 * cross-checked against this pack's goldens; the dictionary adapter attests gender and
 * plural per row.
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

  /** Two genders. French has no neuter. Matches the manifest's `genders:`. */
  genders: ["m", "f"],

  /**
   * Endings, LONGEST FIRST. Both members of a pair are cut, so the singular endings are
   * here too and a pair lands on one shared stem.
   *
   * French plural morphology is mostly silent in speech and visible only in writing, which
   * is exactly why the marking matters. The classes this list buys:
   *   `-al → -aux`   cheval/chevaux, journal/journaux   (`al`, `aux`)
   *   `-eau → -eaux` bateau/bateaux                     (`eau`, `eaux`)
   *   `-eu → -eux`   cheveu/cheveux                     (`eu`, `eux`)
   *   `-ail → -aux`  travail/travaux                    (`ail`, `aux`)
   *   plain `-s`     maison/maisons, fille/filles       (`s`, `e`, `es`)
   * and the invariables — `pays`, `nez`, `voix` — fall out for free: a word already ending
   * in s/x/z takes no plural mark, and markPair colours nothing because nothing changed.
   *
   * Deliberately NOT a complete morphology: `-ou → -oux` (bijou, caillou) is a seven-word
   * closed class and is left to be shown as a stem change rather than given a rule here.
   */
  endings: ["eaux", "aux", "eau", "eux", "ail", "al", "es", "eu", "x", "s", "e"],

  /**
   * The indefinite article. French marks gender in the singular (`un`/`une`) and loses it
   * in the plural (`des` for both) — which is itself the fact a learner has to hold, so the
   * table states it rather than hiding it behind a numeral.
   */
  article: {
    m: { sg: "un", pl: "des" },
    f: { sg: "une", pl: "des" },
  },

  /**
   * `null`. French infinitives end in -er/-ir/-re and so do ordinary nouns: `mer`, `père`,
   * `livre`, `hiver`, `plaisir`, `sourire`. A shape rule would call `mer` a verb, so verb
   * rows carry an explicit `(v)` tag.
   */
  verbHeadword: null,

  other: "word",

  /**
   * `requiredFact` is absent and the manifest's `required_fact:` is empty — see pack.md.
   * French's unpredictable per-lexeme fact is noun gender, and the row already carries it
   * as the tag that makes the row a noun at all.
   */

  trivial: [
    "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "à", "au", "aux",
    "en", "que", "qui", "ne", "pas", "se", "ce", "il", "elle", "on", "y",
  ],
};
