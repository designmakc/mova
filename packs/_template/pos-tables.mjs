// mova:engine
/**
 * POS tables skeleton — fill per the shape documented in scripts/pos.mjs (canonical) and
 * packs/SPEC.md; authoring rules in ../GENERATE.md. Flip the marker above to `mova:pack`
 * when instantiating. Reference implementation: ../ro/pos-tables.mjs.
 *
 * Every ROW of `endings` carries a citation or an `// unverified` comment — the list
 * decides where markPair cuts a form, so a wrong ending mis-marks every word it touches.
 * A citation covers the rows it was checked against, not the block it sits above: the
 * first agent-generated pack put "Source: … (Duden)" over a German list containing `-el`,
 * which is a SINGULAR ending (Mantel, Löffel). Name two real words each ending cuts
 * correctly, or drop it. (Found in the first agent-generated language pack, 2026-08-15.)
 *
 * Docblock REASONS are checked too, not just values. That same pack explained its correct
 * `verbHeadword: null` with "German infinitives are typically cited with `zu`" — false, and
 * setup mines this file. A wrong reason outlives a wrong value: the value gets run.
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

  /** Taught inflection endings, LONGEST FIRST. MUST be [] when the manifest says
   *  inflection: false — packcheck rejects a list under that flag, because nothing runs it
   *  and so nothing can catch a wrong row. Source-or-unverified per row — GENERATE.md step 2. */
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
   *  manifest declares no required fact. (ro: verbs must carry their eu-form.)
   *  The pair moves together: this entry without the manifest key is dead code (loadPack
   *  gates the check on the manifest); the manifest key without this entry is an
   *  unenforceable rule. Ask what the learner must memorise PER LEXEME because no rule
   *  derives it — a German noun's plural, a Mandarin tone — before leaving both empty. */
  // requiredFact: { rowPattern: /.../, factPattern: /.../, hint: "..." },

  /** OPTIONAL — function words leakcheck.mjs won't report as leaks on their own
   *  (still checked inside full answers). Omit ⇒ only a length filter applies. */
  // trivial: [],
};
