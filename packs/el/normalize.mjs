// mova:pack
/**
 * Greek input normalization — fold homoglyphs from other alphabets into the Greek letters.
 *
 * **This is the most load-bearing normalizer of the seven packs**, because Greek is the
 * only one whose look-alikes are not near-misses but *identical glyphs*. `Α` (U+0391,
 * Greek capital alpha), `A` (U+0041, Latin) and `А` (U+0410, Cyrillic) render as the same
 * mark in every font there is. A learner who types `Αθήνα` with a Latin `A` has produced a
 * word no human can distinguish from the right one and no ledger can match — the exact
 * invisible-duplicate failure ERR-002 recorded for Romanian, except that here it is
 * undetectable by eye rather than merely easy to miss.
 *
 * TWO SOURCE ALPHABETS, and both are real for this workspace:
 *
 *   - **Latin.** The default keyboard of nearly every learner. Capitals are the danger:
 *     Α Β Ε Η Ι Κ Μ Ν Ο Ρ Τ Χ Υ Ζ all have identical Latin twins, and proper nouns and
 *     sentence starts are where they land. Lowercase is mostly safe — Greek lowercase has
 *     its own shapes — with one exception, `o`/`ο`, which is total.
 *   - **Cyrillic.** Not hypothetical here: this engine was extracted from a workspace whose
 *     learner types Ukrainian daily, and a Cyrillic `о` pasted into a Greek row is exactly
 *     as invisible as a Latin one.
 *
 * WHAT IS NOT FOLDED, and each matters:
 *
 *   - **Final sigma.** `ς` (U+03C2) and `σ` (U+03C3) are the same letter in two positions,
 *     and which one is correct is decided by the position — `κόσμος` takes both. Folding
 *     either way would corrupt correct spelling. A learner writing `κόσμοσ` has made a real
 *     orthographic error and it is graded as one.
 *   - **The tonos.** A missing accent (`καλημερα` for `καλημέρα`) is a language error, and
 *     in Greek the accent also carries the stress, so dropping it changes the spoken word.
 *     NFC composition handles the decomposed forms; nothing else is repaired.
 *   - **Latin lowercase beyond `o`.** `v` for `ν` and `p` for `ρ` are transliteration
 *     habits rather than glyph collisions, and folding them would corrupt any Latin string
 *     a row legitimately contains.
 *
 * NFC first: macOS paste delivers NFD, which composes to the accented Greek vowels.
 */

/** Homoglyph → the Greek letter it is being mistaken for. Open list — see above. */
export const LOOKALIKES = {
  // ── Latin capitals: identical glyphs, and where a learner's shift key puts them
  "A": "Α", "B": "Β", "E": "Ε", "H": "Η", "I": "Ι", "K": "Κ", "M": "Μ",
  "N": "Ν", "O": "Ο", "P": "Ρ", "T": "Τ", "X": "Χ", "Y": "Υ", "Z": "Ζ",
  // ── Latin lowercase: the one total collision
  "o": "ο",
  // ── Cyrillic capitals
  "А": "Α", "Е": "Ε", "О": "Ο", "Р": "Ρ", "Т": "Τ", "Х": "Χ",
  // ── Cyrillic lowercase
  "а": "α", "е": "ε", "о": "ο", "р": "ρ", "х": "χ", "у": "υ",
};

/** NFC + homoglyph folding. Idempotent; never touches a sigma or repairs a missing tonos. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
