// mova:pack
/**
 * English POS tables — the language half of scripts/pos.mjs, following the shape
 * documented there and in packs/SPEC.md. Reference for STRUCTURE only:
 * packs/ro/pos-tables.mjs (Romanian) — no Romanian vocabulary, labels, or paradigms were
 * copied; every value below is an English fact, verified against a dictionary/grammar
 * reference (Merriam-Webster / general EFL pedagogy) or marked otherwise.
 *
 * WHY THIS PACK LOOKS THINNER THAN packs/ro/. Romanian is a fusional, three-gender,
 * four-conjugation-class language — most of what a Romanian noun or verb row states is
 * unpredictable and must be memorised. English has no grammatical gender, one productive
 * plural pattern (with a closed set of exceptions), and verb morphology that is almost
 * entirely rule-derived from the base form EXCEPT for irregular principal parts. So:
 *   - `genders: []`, `article: {}` — nothing to teach here (see pack.md).
 *   - `endings` is short and deliberately does not try to encode every English spelling
 *     rule (e.g. consonant doubling in "run→running", "big→bigger") — the ending list only
 *     decides where markPair cuts a form for the two-colour display; the doubled
 *     consonant still shows up correctly as a one-letter stem change, which is the true
 *     shape of that alternation, not a wrong one.
 *   - `requiredFact` targets irregular verbs ONLY, not every verb — see pack.md and the
 *     docblock on `requiredFact` below for why that is a deliberate, real decision and not
 *     an empty default.
 */

export const TABLES = {
  /** Facet order on the deck, and the word the learner reads on the chip. */
  types: [
    { key: "noun", label: "nouns" },
    { key: "verb", label: "verbs" },
    { key: "adj", label: "adjectives" },
    { key: "word", label: "other words" },
    { key: "phrase", label: "phrases" },
    { key: "pattern", label: "patterns" },
  ],

  /** Singular chip text — a row's own badge says "noun", not "nouns". */
  typeLabel: {
    noun: "noun",
    verb: "verb",
    adj: "adjective",
    word: "word",
    phrase: "phrase",
    pattern: "pattern",
  },

  /**
   * Tags accepted in the parenthetical's first slot, and the facet each maps to.
   * `v` — a regular verb (all forms rule-derived from the base). `virr` — an irregular
   * verb, tagged separately so `requiredFact.rowPattern` below can find exactly the rows
   * that must carry their principal parts, and not the rows that don't need to.
   */
  tags: {
    n: "noun",
    v: "verb",
    virr: "verb",
    adj: "adj",
    adv: "word", prep: "word", conj: "word", interj: "word", num: "word", det: "word",
  },

  /** English has no grammatical gender. Matches the manifest's (empty) `genders:` line. */
  genders: [],

  /**
   * Endings this level actually teaches, longest first — the list decides where a form is
   * cut, so a regular plural/past/comparative lands its `mk` on the added ending rather
   * than smearing it across a fake stem change.
   * Source: standard EFL descriptions of English inflectional morphology (regular plural
   * -s/-es/-ies; regular past/participle -ed; progressive -ing; comparative -er/-est) —
   * verified against golden/pairs.json, not against a single named reference.
   *   - "ies"  cuts: cities → cit+ies, tries → tr+ies
   *   - "ing"  cuts: running → runn+ing (the doubled consonant surfaces as a stem change,
   *             which is the correct shape of that rule, not an artifact)
   *   - "est"  cuts: quickest → quick+est
   *   - "es"   cuts: boxes → box+es, watches → watch+es
   *   - "er"   cuts: quicker → quick+er
   *   - "ed"   cuts: tested → test+ed, clicked → click+ed
   *   - "s"    cuts: designs → design+s, teams → team+s
   */
  endings: ["ies", "ing", "est", "es", "er", "ed", "s"],

  /** No count-article system in English (a/an/the do not encode gender or count the way
   *  Romanian's un/doi does) — nothing for this table to hold. */
  article: {},

  /**
   * English does not mark an untagged headword as a verb by any citation-form affix (no
   * equivalent of Romanian's `a `) — "to" before a bare verb is the infinitive marker in
   * SPEECH, but ledger rows are not written with a leading "to" and plenty of untagged
   * bare words are nouns or adjectives, not verbs (`design`, `light`, `fast`). So verbs
   * always need an explicit tag (`v` or `virr`), and this stays null; there is no reason
   * to invent a heuristic to avoid it.
   */
  verbHeadword: null,

  /** The residue facet — untagged one-word rows land here on the deck (and fail CI). */
  other: "word",

  /**
   * The manifest's `required_fact: irregular-verb-principal-parts`, made checkable: a row
   * tagged `virr` (an irregular verb — go, write, understand, …) must carry its past tense
   * and past participle in notes, because no spelling rule of English derives them from
   * the base form. A row tagged plain `v` (a regular verb) is NOT required to, because its
   * past/participle/progressive are 100% predictable from the base form plus the endings
   * above — requiring them there would be requiring the learner to memorise something a
   * rule already gives them, which is the opposite of what this guard is for.
   * state/ledgers.test.ts enforces it once ledger rows exist.
   */
  requiredFact: {
    rowPattern: /\(virr\b/,
    factPattern: /\bpast:\s*\S+.*\bpp:\s*\S+/i,
    hint: 'irregular verb rows carry their past tense and past participle in notes, e.g. "past: went; pp: gone"',
  },

  /**
   * Function words too short and frequent to report as leaks on their own —
   * leakcheck.mjs still checks them as part of a full answer, never solo.
   */
  trivial: ["a", "an", "the", "to", "of", "in", "on", "is", "it", "and", "but"],
};
