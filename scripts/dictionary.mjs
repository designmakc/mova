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

import { pathToFileURL } from "node:url";

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

/**
 * CLI — the reachability probe setup's Topic 7 and smoke's pack check both need:
 *
 *   node scripts/dictionary.mjs <word>          # the active pack's adapter
 *   node scripts/dictionary.mjs <word> --pack ro
 *
 * Exit 0 = the source answered (found or honestly not-found). Exit 1 = no adapter, or the
 * lookup threw — that is the null-adapter branch of docs/mechanics/verification.md, and
 * the instance is told so once. Without this, a probe run as `node scripts/dictionary.mjs
 * casă` printed nothing and exited 0, which reads as a pass and silently blesses an
 * unreachable dictionary (found by the first full setup proof run, 2026-08-14).
 */
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  // NOT a top-level await: pack.mjs imports THIS module, so awaiting the import here
  // would deadlock (pack.mjs waits for dictionary.mjs to finish evaluating, and
  // dictionary.mjs waits for pack.mjs). Deferring to a floating async call lets module
  // evaluation complete first, then the dynamic import resolves normally.
  void (async () => {
    const argv = process.argv.slice(2);
    const word = argv.find((a) => !a.startsWith("--"));
    const packIdx = argv.indexOf("--pack");
    const code = packIdx > -1 ? argv[packIdx + 1] : undefined;
    if (!word) {
      console.error("usage: node scripts/dictionary.mjs <word> [--pack <code>]");
      process.exit(2);
    }
    try {
      const { loadPack } = await import("./pack.mjs");
      const pack = await loadPack(code);
      if (!canVerify(pack.dictionary)) {
        console.error(`packs/${pack.code}: no dictionary adapter — facts run unattested.`);
        process.exit(1);
      }
      const hit = await pack.dictionary.lookup(word);
      console.log(JSON.stringify(hit, null, 2));
      process.exit(0);
    } catch (err) {
      console.error(`dictionary probe failed: ${err.message}`);
      process.exit(1);
    }
  })();
}
