// mova:engine
/**
 * POS tables skeleton — fill per the shape documented in scripts/pos.mjs (canonical) and
 * packs/SPEC.md; authoring rules in ../GENERATE.md. Flip the marker above to `mova:pack`
 * when instantiating. Reference implementation: ../ro/pos-tables.mjs.
 *
 * Every ROW of `endings` carries a citation or an `// unverified` comment — the list
 * decides where markPair cuts a form, so a wrong ending mis-marks every word it touches.
 */

export const TABLES = {
  /** Facet order on the deck; label is the PLURAL chip text. Must include "phrase" and
   *  "pattern" (the engine assigns those itself) plus every facet `tags` maps to. */
  types: [
    // { key: "noun", label: "nouns" },
    // { key: "verb", label: "verbs" },
    { key: "phrase", label: "phrases" },
    // { key: "word", label: "other words" },
    { key: "pattern", label: "patterns" },
  ],

  /** Singular chip text — one entry per types key. */
  typeLabel: {
    // noun: "noun",
    phrase: "phrase",
    // word: "word",
    pattern: "pattern",
  },

  /** Parenthetical first-slot tags → facet key. Gender letters map to "noun". */
  tags: {
    // m: "noun", f: "noun",
    // v: "verb",
    // adv: "word", prep: "word",
  },

  /** The tags that are gender letters. [] when the language has no grammatical gender.
   *  Must match the manifest's `genders:` line — packcheck compares them. */
  genders: [],

  /** Taught inflection endings, LONGEST FIRST. [] when the manifest says inflection: false.
   *  Source-or-unverified per row — see GENERATE.md step 2. */
  endings: [],

  /** Count-article pair per gender, spoken by speech(). {} when articles don't exist. */
  article: {},

  /** RegExp an UNTAGGED headword must match to count as a verb (ro: /^a\s+\S/), or null —
   *  verbs then always need an explicit tag. */
  verbHeadword: null,

  /** The residue facet null-classified rows are filed under on the deck, or null.
   *  packcheck keeps the golden set's null+other rate under 20%. */
  other: null,

  /** OPTIONAL — the manifest's `required_fact:` made checkable by state/ledgers.test.ts:
   *  rows whose target matches rowPattern must carry factPattern in notes. Omit when the
   *  manifest declares no required fact. (ro: verbs must carry their eu-form.) */
  // requiredFact: { rowPattern: /.../, factPattern: /.../, hint: "..." },

  /** OPTIONAL — function words leakcheck.mjs won't report as leaks on their own
   *  (still checked inside full answers). Omit ⇒ only a length filter applies. */
  // trivial: [],
};
