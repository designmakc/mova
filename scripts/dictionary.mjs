// mova:engine
/**
 * The dictionary adapter interface — how the workspace verifies language facts.
 *
 * A pack MAY ship `packs/<code>/dictionary.mjs` exporting `createAdapter()`. The adapter
 * contract is one async method:
 *
 *   lookup(word) → {
 *     found:  boolean,
 *     source: string,          // e.g. "dexonline" — named in every verification trail
 *     gender: string | null,   // one of the pack's declared gender labels, if applicable
 *     forms:  string[],        // inflected forms the source attests (plural, key conjugations)
 *     url:    string | null,   // human-checkable reference for the entry
 *   }
 *
 * WHY. limba's rule was "verify gender/plural/conjugation BEFORE teaching it" with
 * scripts/dex.mjs (dexonline) as the only implementation — Romanian-only. The rule is
 * generic; the source is not. Every fact-consumer (vocab capture, factcheck.mjs, the hub's
 * confidence panel) talks to this interface and never to a provider.
 *
 * A pack WITHOUT a dictionary is legal: loadPack() falls back to the null adapter below,
 * and docs/mechanics/verification.md then requires every ledger fact to be tutor-confirmed
 * or carry the unverified marker. The hub says so on the confidence panel — a missing
 * dictionary is honest, never silent.
 */

/** The fallback adapter: finds nothing, verifies nothing, says so. */
export function nullAdapter() {
  return {
    source: "none",
    async lookup() {
      return { found: false, source: "none", gender: null, forms: [], url: null };
    },
  };
}

/** True when `adapter` can actually verify facts. */
export function canVerify(adapter) {
  return Boolean(adapter) && adapter.source !== "none";
}
