// mova:engine
/**
 * Normalization skeleton — NFC plus input-method look-alike folding. Flip the marker to
 * `mova:pack` when instantiating. Contract: packs/SPEC.md; reference: ../ro/normalize.mjs.
 *
 * The governing principle (it survives every language): a dead-key neighbour of a target
 * letter is INPUT METHOD, never a language error — fold it silently. A genuinely missing
 * diacritic is a language error — pass it through untouched. The map is an open list;
 * add each new look-alike (with a golden/normalize.json fixture) the session it appears.
 *
 * A MAP ENTRY'S KEY IS NEVER ITS VALUE. `"ä": "ä"` folds nothing. A map of nothing but
 * such entries makes this module the identity function while the pack advertises folding —
 * which is what shipped, under a pack.md promising "ae→ä, oe→ö, ue→ü", with six golden
 * fixtures that all passed against `s => s`. packcheck now rejects identity entries, NFD
 * keys (they can never match after the NFC pass), and a fixture set with no
 * `input !== expected` case. (Found in the first agent-generated language pack, 2026-08-15.)
 *
 * A key is a look-alike CODEPOINT from another alphabet (ǎ U+01CE for ă) or a keyboard
 * DIGRAPH the learner's layout produces (ae for ä). If the target language has neither,
 * leave the map empty, say so in the pack prose, and claim no folding anywhere — packcheck
 * runs every fold the prose advertises.
 */

/** Look-alike codepoint → the letter it is being mistaken for. Start empty; grow on evidence. */
export const LOOKALIKES = {
  // "ǎ": "ă", // example (ro): a with caron, from a Czech/pinyin dead key
  // "ae": "ä", // example (de): the digraph a non-German layout produces for the umlaut
};

/** NFC + look-alike folding. Idempotent. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
