// mova:engine
/**
 * Normalization skeleton — NFC plus input-method look-alike folding. Flip the marker to
 * `mova:pack` when instantiating. Contract: packs/SPEC.md; reference: ../ro/normalize.mjs.
 *
 * The governing principle (it survives every language): a dead-key neighbour of a target
 * letter is INPUT METHOD, never a language error — fold it silently. A genuinely missing
 * diacritic is a language error — pass it through untouched. The map is an open list;
 * add each new look-alike (with a golden/normalize.json fixture) the session it appears.
 */

/** Look-alike codepoint → the letter it is being mistaken for. Start empty; grow on evidence. */
export const LOOKALIKES = {
  // "ǎ": "ă", // example (ro): a with caron, from a Czech/pinyin dead key
};

/** NFC + look-alike folding. Idempotent. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
