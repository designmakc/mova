// mova:pack
/**
 * Spanish input normalization — fold keyboard look-alikes into the real letters.
 *
 * THE PRINCIPLE (packs/SPEC.md, docs/mechanics/verification.md): input method is never a
 * language error — fold it silently, never grade it. A genuinely MISSING diacritic is a
 * language error and must pass through untouched: `cancion` stays `cancion` and is graded
 * against `canción`.
 *
 * WHAT SPANISH ACTUALLY CONFUSES. The learner is typing on a layout that is not Spanish,
 * and two things go wrong.
 *
 *   1. **ñ.** No non-Spanish layout has it. The dead keys within reach produce n with
 *      acute (`ń`, Polish), caron (`ň`, Czech), grave (`ǹ`) or dot above (`ṅ`) — all
 *      NFC-stable, all rendering close enough that two ledger rows spelled `año` and `ańo`
 *      sit in the queue as invisible duplicates. This is the ERR-002 shape from the
 *      reference pack, in Spanish clothes.
 *
 *   2. **The wrong accent direction.** On an Italian or French layout `à` and `è` are
 *      single keys while `á` and `é` need a dead key, so they arrive tilted the wrong way.
 *      Folding these is safe for a reason specific to Spanish and stated here because it
 *      would NOT be safe in most languages: **Spanish uses no grave and no circumflex at
 *      all.** `à` is not a possible Spanish spelling of anything, so folding it to `á`
 *      cannot mask a real error — there is no Spanish word it could have been correct in.
 *      In French or Italian the same fold would destroy a meaning distinction, which is
 *      why this map belongs to the pack and not to the engine.
 *
 * NOT FOLDED, deliberately: `ü` (`pingüino`, `vergüenza`) is a real Spanish letter and
 * carries meaning; and `u` typed for `ü` is a language error, not input method.
 *
 * NFC first: macOS paste often delivers NFD (a + combining acute), which composes to the
 * real letters or to the look-alikes above; folding runs on the composed text.
 *
 * The list is OPEN. When a new look-alike shows up in a real ledger, add it and a
 * golden/normalize.json fixture in the same session.
 */

/** Look-alike → the Spanish letter it is being mistaken for. Open list — see above. */
export const LOOKALIKES = {
  // ñ, reached by whichever dead key the layout offers
  "ń": "ñ", "Ń": "Ñ", // n with acute (Polish)
  "ň": "ñ", "Ň": "Ñ", // n with caron (Czech)
  "ǹ": "ñ", "Ǹ": "Ñ", // n with grave
  "ṅ": "ñ", "Ṅ": "Ñ", // n with dot above

  // Grave — not a Spanish diacritic, so this can only ever be a mistyped acute
  "à": "á", "À": "Á",
  "è": "é", "È": "É",
  "ì": "í", "Ì": "Í",
  "ò": "ó", "Ò": "Ó",
  "ù": "ú", "Ù": "Ú",

  // Circumflex — likewise not Spanish
  "â": "á", "Â": "Á",
  "ê": "é", "Ê": "É",
  "î": "í", "Î": "Í",
  "ô": "ó", "Ô": "Ó",
  "û": "ú", "Û": "Ú",

  // Turkish dotless i, a common paste artefact that renders as a bare i
  "ı": "i", "İ": "I",
};

/** NFC + look-alike folding. Idempotent; never repairs a genuinely missing accent. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
