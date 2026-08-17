// mova:pack
/**
 * Portuguese input normalization — fold keyboard look-alikes into the real letters.
 *
 * WHAT PORTUGUESE USES: acute (`á é í ó ú`), circumflex on a/e/o (`â ê ô`), the tilde
 * (`ã õ`), the cedilla (`ç`), and the grave on a single letter — `à`, and only as the
 * crase contraction (`à`, `às`). That inventory is what makes the folds below safe.
 *
 * WHAT IS FOLDED:
 *
 *   - **grave on e, i, o, u** (`è ì ò ù`) → the acute. Portuguese puts a grave on `a` and
 *     nowhere else, so these can only be a dead-key slip.
 *   - **circumflex on i and u** (`î û`) → the acute. Portuguese circumflexes only a, e, o.
 *   - the Turkish dotless i, a paste artefact.
 *
 * NOT FOLDED, and each for a reason:
 *
 *   - **`à` is left exactly alone.** It is a real Portuguese letter carrying the crase, and
 *     folding it to `á` would destroy `vou à praia`.
 *   - **the tilde is never touched.** `ã` and `õ` are the language's signature and a
 *     missing tilde changes the word (`pao`/`pão`).
 *   - **`â ê ô` are left alone** — they distinguish real pairs against the acute
 *     (`avô`/`avó`, grandfather against grandmother, is the one every learner meets).
 *
 * A MISSING accent is a language error and is never repaired here. Portuguese carries a
 * heavy functional load on its diacritics, so this map is deliberately narrower than the
 * Spanish one even though the two languages look alike on the page.
 *
 * NFC first: macOS paste often delivers NFD.
 */

/** Look-alike → the Portuguese letter it is being mistaken for. Open list. */
export const LOOKALIKES = {
  "è": "é", "È": "É", // grave — Portuguese graves only `a`
  "ì": "í", "Ì": "Í",
  "ò": "ó", "Ò": "Ó",
  "ù": "ú", "Ù": "Ú",
  "î": "í", "Î": "Í", // circumflex on i/u is not Portuguese
  "û": "ú", "Û": "Ú",
  "ı": "i", "İ": "I", // Turkish dotless i, a paste artefact
};

/** NFC + look-alike folding. Idempotent; never repairs a missing accent or tilde. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
