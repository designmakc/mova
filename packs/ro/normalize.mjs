// mova:pack
/**
 * Romanian input normalization — fold keyboard look-alikes into the real letters.
 *
 * The learner types on a non-Romanian layout, and the dead keys nearest to ă, ș, ț
 * produce letters from OTHER alphabets that render almost identically: ǎ (U+01CE, caron —
 * Czech/pinyin), ş (U+015F) and ţ (U+0163) with cedillas (Turkish), ś (U+015B, acute),
 * ā (U+0101, macron). These are NFC-stable, so plain normalization sails straight past
 * them — and two ledger rows spelled „fără" and „fǎrǎ" are invisible duplicates that both
 * silently sit in the queue (limba ERR-002, 2026-07-31).
 *
 * THE PRINCIPLE GOVERNS, NOT THE LIST. A dead-key neighbour of a target letter is input
 * method, never a language error: fold it silently, never grade it. The map below is open —
 * when a new look-alike shows up, add it (and a golden/normalize.json fixture) in the same
 * session. The opposite case is just as firm: a MISSING diacritic (adresa for adresă) is a
 * graded language error (ORTH-DIA) and is never repaired here.
 *
 * NFC first: macOS paste often delivers NFD (a + combining breve), which composes to the
 * very look-alikes above or to the real letters; folding runs on the composed text.
 */

/** Look-alike → the Romanian letter it is being mistaken for. Open list — see above. */
export const LOOKALIKES = {
  "ǎ": "ă", // a with caron (Czech/pinyin)
  "Ǎ": "Ă",
  "ş": "ș", // s with cedilla (Turkish)
  "Ş": "Ș",
  "ţ": "ț", // t with cedilla (Turkish)
  "Ţ": "Ț",
  "ś": "ș", // s with acute
  "Ś": "Ș",
  "ā": "ă", // a with macron
  "Ā": "Ă",
};

/** NFC + look-alike folding. Idempotent; never touches a genuinely missing diacritic. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
