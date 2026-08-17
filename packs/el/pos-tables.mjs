// mova:pack
/**
 * Greek POS tables — the language half of scripts/pos.mjs for `packs/el`.
 *
 * **The first pack in a non-Latin script**, and the assumptions that survived that are
 * worth naming: the tag grammar, the ending-cut model and the article table all work
 * unchanged. What did NOT survive was in the shared dictionary adapter, which read gender
 * from the position of a word in the rendered line and found nothing behind a Greek
 * transliteration (fixed 2026-08-17 by reading the gender markup instead).
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
    m: "noun", f: "noun", n: "noun",
    adj: "adj",
    v: "verb",
    interog: "interog",
    adv: "word", prep: "word", part: "word", interj: "word", conj: "word", num: "word",
    pron: "word",
  },

  /** Three genders. Matches the manifest's `genders:`. */
  genders: ["m", "f", "n"],

  /**
   * Endings, LONGEST FIRST. Greek pluralises by swapping the ending outright, and because
   * the accent is written, both members must be cut at the accented form where one exists —
   * which is why `ό ά ί ής ές` sit here beside their unaccented twins.
   *
   * The classes this buys, each a clean single swap:
   *   -ο → -α      βιβλίο/βιβλία, νερό/νερά
   *   -ος → -οι    άνθρωπος/άνθρωποι, δρόμος/δρόμοι
   *   -α → -ες     γυναίκα/γυναίκες, μέρα/μέρες
   *   -ας → -ες    άντρας/άντρες
   *   -ης → -ες    μαθητής/μαθητές
   *   -η → -εις    πόλη/πόλεις
   *   -ι → -ια     χέρι/χέρια, σπίτι/σπίτια
   *   -ί → -ιά     παιδί/παιδιά    (the accent moves with the ending, and is shown moving)
   *
   * Left to show as stem changes, correctly: the neuter -ας/-ατα and -ως/-ώτα classes
   * (`κρέας/κρέατα`, `γάλα/γάλατα`, `φως/φώτα`), where the stem genuinely grows.
   * Indeclinable loanwords (`ταξί`, `μετρό`) are marked nowhere at all, which is the truth.
   */
  endings: ["εις", "ους", "ιά", "ια", "ος", "οι", "ας", "ες", "ής", "ές", "ών",
            "ό", "ά", "ί", "ι", "α", "ο", "η", "ς"],

  /**
   * The DEFINITE article — the gender test a Greek learner actually runs, and the one
   * carried in every wordlist. Note the feminine plural is `οι`, the same word as the
   * masculine plural: gender collapses in the plural nominative for m/f and stays distinct
   * for the neuter, which is itself worth seeing.
   */
  article: {
    m: { sg: "ο", pl: "οι" },
    f: { sg: "η", pl: "οι" },
    n: { sg: "το", pl: "τα" },
  },

  /**
   * NOT null — and Greek is only the second pack that can do this (the reference Romanian
   * pack is the other).
   *
   * Greek dictionaries cite a verb in the **first person singular present**, not in an
   * infinitive — `γράφω` "I write", `μιλάω` "I speak", `έρχομαι` "I come". That form ends
   * in -ω, -ώ or -μαι, and ordinary nouns essentially never do: the exceptions (`ηχώ`,
   * `πειθώ`) are a tiny closed feminine class, and they are safe anyway because this rule
   * only ever sees an UNTAGGED headword — a noun row carries its gender letter and is
   * classified by that first.
   *
   * So Greek verb rows need no `(v)` tag, unlike all five Romance and Germanic packs.
   */
  verbHeadword: /[ωώ]$|μαι$/,

  other: "word",

  /** `requiredFact` is absent — see pack.md. */

  trivial: [
    "ο", "η", "το", "οι", "τα", "του", "της", "των", "και", "ή", "σε", "με", "για",
    "να", "θα", "δεν", "μια", "ένα", "που", "από",
  ],
};
