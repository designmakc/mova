// mova:pack
/**
 * French input normalization — fold keyboard look-alikes into the real letters.
 *
 * THE PRINCIPLE (packs/SPEC.md): input method is never a language error — fold it
 * silently. A genuinely MISSING accent is a language error and passes through untouched:
 * `eleve` stays `eleve` and is graded against `élève`.
 *
 * WHAT FRENCH CAN SAFELY FOLD, and why it is a shorter list than Spanish's. French uses a
 * lot of the Latin-1 range itself — à â ä é è ê ë î ï ô ö ù û ü ÿ ç — so most "wrong
 * accent" folds that are safe in Spanish are destructive here: `é` and `è` are different
 * letters that distinguish real words, and folding either way would silently repair or
 * create an error.
 *
 * What is left is the set of diacritics French does NOT use at all, where a fold cannot
 * hide a mistake because the input could never have been correct French:
 *
 *   - **acute on a, i, o, u** — French puts an acute only on `e`. `á í ó ú` are not French
 *     letters, so they are a dead-key slip for the grave or circumflex the word wants.
 *     The target is chosen per letter from what French actually spells: `à` (là, déjà),
 *     `î` (île, s'il vous plaît), `ô` (hôtel, côté), `ù` (où — the only French word with ù).
 *   - **c with acute or circumflex** (`ć`, `ĉ`) → `ç`, the cedilla being unreachable on
 *     most layouts.
 *   - **the Turkish dotless i**, a paste artefact that renders as a bare i.
 *
 * NOT FOLDED, deliberately: nothing in the é/è/ê family, and no digraph. `oe` is left
 * alone — `œ` is a real ligature but `coexister` and `moelle` spell `oe` as two letters,
 * so a blanket fold would corrupt them.
 *
 * NFC first: macOS paste often delivers NFD, which composes to the letters above.
 *
 * The list is OPEN — add a look-alike and its golden fixture in the session it appears.
 */

/** Look-alike → the French letter it is being mistaken for. Open list — see above. */
export const LOOKALIKES = {
  "á": "à", "Á": "À", // acute a — French puts no acute on a
  "í": "î", "Í": "Î", // acute i — the word wants the circumflex (île)
  "ó": "ô", "Ó": "Ô", // acute o — the word wants the circumflex (hôtel)
  "ú": "ù", "Ú": "Ù", // acute u — the word wants the grave (où)
  "ć": "ç", "Ć": "Ç", // c with acute
  "ĉ": "ç", "Ĉ": "Ç", // c with circumflex
  "ı": "i", "İ": "I", // Turkish dotless i, a paste artefact
};

/** NFC + look-alike folding. Idempotent; never repairs a genuinely missing accent. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
