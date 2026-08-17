// mova:pack
/**
 * Italian input normalization — fold keyboard look-alikes into the real letters.
 *
 * WHAT ITALIAN USES: the grave on a, i, o, u (`à ì ò ù`) and both accents on e (`è`, `é`
 * — `caffè` against `perché`, a real distinction). That is the whole inventory.
 *
 * WHAT IS FOLDED: the diacritics Italian does not use, where a fold cannot hide an error
 * because the input could never have been correct Italian.
 *
 *   - **acute on a, i, u** (`á í ú`) → the grave the word wants. Italian never puts an
 *     acute on these three; on a layout where the acute is the easy dead key they arrive
 *     tilted the wrong way.
 *   - **circumflex** (`â ê î ô û`) → the grave. Modern Italian does not use the
 *     circumflex at all; the archaic plural `principî` is the exception that proves it and
 *     is not A1–B1 material.
 *   - the Turkish dotless i, a paste artefact.
 *
 * NOT FOLDED, deliberately: **anything in the e family.** `è` and `é` are different
 * letters distinguishing real words, and `ó`/`ò` is a live distinction in dictionaries
 * (open vs closed o). Folding either would repair or create an error silently, which is
 * exactly what this file exists to avoid.
 *
 * A MISSING accent (`perche` for `perché`, `citta` for `città`) is a language error and is
 * never repaired here — in Italian the final accent is also the stress mark, so dropping
 * it changes the word's shape in speech.
 *
 * NFC first: macOS paste often delivers NFD.
 */

/** Look-alike → the Italian letter it is being mistaken for. Open list. */
export const LOOKALIKES = {
  "á": "à", "Á": "À", // acute a — Italian puts no acute on a
  "í": "ì", "Í": "Ì", // acute i
  "ú": "ù", "Ú": "Ù", // acute u
  "â": "à", "Â": "À", // circumflex — not modern Italian
  "ê": "è", "Ê": "È",
  "î": "ì", "Î": "Ì",
  "ô": "ò", "Ô": "Ò",
  "û": "ù", "Û": "Ù",
  "ı": "i", "İ": "I", // Turkish dotless i, a paste artefact
};

/** NFC + look-alike folding. Idempotent; never repairs a missing accent. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
