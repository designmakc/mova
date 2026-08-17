// mova:pack
/**
 * German input normalization — fold keyboard look-alikes into the real letters.
 *
 * ⚠️ THE DIGRAPHS ARE NOT FOLDED, AND THAT IS THE MOST IMPORTANT LINE IN THIS FILE.
 *
 * The first agent-generated German pack (2026-08-15) advertised `ae→ä, oe→ö, ue→ü` in its
 * manifest and shipped a map whose every entry mapped a letter to itself. The advertised
 * behaviour was not merely unimplemented — it would have been WRONG to implement:
 *
 *   Steuer, Feuer, teuer, neue, Museum, Aerobic, Michael, Israel, Zoo, Poesie
 *
 * every one of those spells `ue`, `ae` or `oe` as two ordinary letters. A blanket digraph
 * fold turns `Steuer` into `Stüer` and `Museum` into `Musüm`. The transcription convention
 * is real, but it is context-dependent and belongs to a human reading intent, never to a
 * silent normalizer that cannot ask.
 *
 * `ss` for `ß` is the same trap in reverse and is left alone for a second reason: it is a
 * genuine orthographic distinction (`Maße`/`Masse`), and Swiss Standard German writes `ss`
 * for every `ß` on purpose. Folding it would grade a correct Swiss spelling as an error.
 *
 * WHAT IS FOLDED: only true look-alike CODEPOINTS — letters from other alphabets that
 * render close enough to an umlaut or an eszett to sit in the ledger as invisible
 * duplicates.
 *
 *   - Hungarian double acute `ő ű` — the nearest dead key to `ö ü` on several layouts, and
 *     visually a hair apart at body size.
 *   - Macron `ā ō ū` — a common dead-key neighbour, and Latin-alphabet enough to pass a
 *     glance.
 *   - Greek beta `β` for `ß`. These are different letters that look almost identical in
 *     most sans-serif faces; a pasted `β` is never German.
 *   - The Turkish dotless i, a paste artefact that renders as a bare i.
 *
 * A genuinely missing umlaut (`schon` for `schön`, `Mutter`/`Mütter`) is a language error
 * and is never repaired here — in German it is frequently a DIFFERENT WORD, which is the
 * strongest possible argument for keeping this map narrow.
 *
 * NFC first: macOS paste often delivers NFD, which composes to the real umlauts.
 */

/** Look-alike → the German letter it is being mistaken for. Open list — see above. */
export const LOOKALIKES = {
  "ő": "ö", "Ő": "Ö", // Hungarian double acute
  "ű": "ü", "Ű": "Ü",
  "ā": "ä", "Ā": "Ä", // macron
  "ō": "ö", "Ō": "Ö",
  "ū": "ü", "Ū": "Ü",
  "β": "ß",           // Greek beta — never German
  "ı": "i", "İ": "I", // Turkish dotless i, a paste artefact
};

/** NFC + look-alike folding. Idempotent; never repairs a missing umlaut. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
