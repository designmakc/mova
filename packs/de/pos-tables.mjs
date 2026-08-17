// mova:pack
/**
 * German POS tables — the language half of scripts/pos.mjs for `packs/de`.
 *
 * Shape contract: scripts/pos.mjs and packs/SPEC.md. This pack replaces the first
 * agent-generated German pack (2026-08-15), which passed its own check while shipping an
 * identity-function normalizer, `inflection: false` above a fixture file full of umlaut
 * plurals, and an empty `required_fact:` that silently disabled the ledger guard. Every
 * one of those is now either enforced or argued in prose.
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

  /** Three genders, and none of them predictable from the noun. Matches `genders:`. */
  genders: ["m", "f", "n"],

  /**
   * Endings, LONGEST FIRST. German plurals come in five suffix classes — `-e`, `-er`,
   * `-(e)n`, `-s`, and zero — and any of them may be accompanied by an umlaut on the stem
   * vowel. That combination is the whole point of marking:
   *
   *   Buch/Bücher    stem umlaut + `-er`   → two colours, which is the truth
   *   Stadt/Städte   stem umlaut + `-e`    → two colours
   *   Mann/Männer    stem umlaut + `-er`   → two colours
   *   Kind/Kinder    no umlaut  + `-er`    → one colour
   *   Frau/Frauen    no umlaut  + `-en`    → one colour
   *   Auto/Autos     no umlaut  + `-s`     → one colour
   *   Mädchen, Löffel  zero plural         → no colour at all
   *
   * `n` alone is deliberately NOT in the list. It would cut `Mann` as `Man`+`n` and turn a
   * clean umlaut pair into a fake stem change; `-en` covers every plural that needs it,
   * because a noun taking `-n` (Blume/Blumen) already ends in the `-e` this list cuts.
   */
  endings: ["en", "er", "e", "s"],

  /**
   * The DEFINITE article, not the indefinite — in German this is the gender test a learner
   * actually runs, and the plural collapsing to `die` for all three genders is itself a
   * fact worth showing.
   */
  article: {
    m: { sg: "der", pl: "die" },
    f: { sg: "die", pl: "die" },
    n: { sg: "das", pl: "die" },
  },

  /**
   * `null`. German infinitives end in `-en`, and so do plurals, dative plurals and a pile
   * of ordinary words: `oben`, `eben`, `gegen`, `neben`, `Damen`. Capitalisation is the
   * real signal for nouns, but it says nothing about verbs, so verb rows carry `(v)`.
   */
  verbHeadword: null,

  other: "word",

  /**
   * `requiredFact` is absent — and for German this is a CLOSER call than for the Romance
   * packs, so the reasoning is in pack.md rather than compressed here. Short version:
   * gender and plural are exactly the unpredictable per-lexeme facts, and the row already
   * carries both in its target cell (`Buch (n, Bücher)`); this guard matches its pattern
   * against the NOTES cell, so declaring it would demand a second copy of a fact the row
   * already holds.
   */

  trivial: [
    "der", "die", "das", "den", "dem", "des", "ein", "eine", "und", "oder", "in", "im",
    "zu", "mit", "auf", "für", "ist", "nicht", "es", "sie", "er", "ich", "du", "wir",
  ],
};
