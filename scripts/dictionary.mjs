// mova:engine
/**
 * The dictionary adapter interface — how the workspace verifies language facts.
 *
 * A pack MAY ship `packs/<code>/dictionary.mjs` exporting `createAdapter(options?)`. The
 * adapter contract is one async method:
 *
 *   lookup(word) → {
 *     found:   boolean,
 *     source:  string,          // e.g. "dexonline" — named in every verification trail
 *     genders: string[],        // EVERY gender label the source states for this headword
 *     forms:   string[],        // inflected forms the source attests (plural, key conjugations)
 *     url:     string | null,   // human-checkable reference for the entry
 *   }
 *
 * `options.fetch` — when passed, the adapter MUST use it instead of the global `fetch`.
 * This is what lets `golden/dictionary.json` replay recorded responses so packcheck can
 * test the parser with no network (see `packs/SPEC.md`). Adapters that ignore it still
 * work; they just cannot be tested offline, which the pack then has to live with.
 *
 * WHY `genders` IS A LIST. A headword legitimately carries more than one gender, because
 * it carries more than one sense: Romanian `calculator` is neuter as *computer* and
 * masculine as *person who calculates*, and `ochi` is a masculine noun and also a verb.
 * The first version of this contract returned ONE gender and one flat `forms` list, and
 * the ro adapter filled them from whichever sense the source happened to print first.
 * Measured against a real 79-row ledger it produced 14 wrong verdicts — 12 of them
 * contradictions reported against correct rows, two of which are words the pack's own
 * golden fixtures list as correct examples (2026-08-15). A verification tool that cries
 * wolf on 18% of a clean ledger is worse than no tool: the learner learns to ignore it.
 *
 * So: report everything the source states, and let the consumer apply the rule that
 * **one attesting sense is attestation** (`scripts/factcheck.mjs`). The known cost is
 * accepted deliberately — a row pairing sense A's gender with sense B's plural passes,
 * because gender and forms are checked independently. That is a false NEGATIVE, and in a
 * tool whose whole value is being believed, silence is cheaper than a false alarm.
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
      return { found: false, source: "none", genders: [], forms: [], url: null };
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
