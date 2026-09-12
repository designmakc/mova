// mova:pack
/**
 * English input normalization — fold keyboard look-alikes into the real letters.
 *
 * English has essentially no diacritics of its own (loanwords like naïve/café keep
 * theirs or drop them as free spelling variants — see below), so the dead-key problem
 * packs/ro/normalize.mjs documents does not apply here. What DOES apply to this learner:
 * this instance's interview recorded a Cyrillic-capable keyboard layout (the learner types
 * Russian/Ukrainian daily). Several Cyrillic letters are visually indistinguishable from
 * Latin ones at normal reading size — а(U+0430)/a, е(U+0435)/e, о(U+043E)/o, р(U+0440)/p,
 * с(U+0441)/c, х(U+0445)/x, and their uppercase pairs — the same confusable-script problem
 * IDN-homograph and browser anti-spoofing guidance documents for domain names
 * **(assumed applied here to typed English text; not independently measured against this
 * learner's actual keystrokes — it is a documented general risk for anyone switching
 * between a Cyrillic and a Latin keyboard, not a claim about this specific learner's
 * error rate)**. A stray Cyrillic keystroke landing inside an English word is input
 * method, never a spelling error, so it is folded here and never scored as one.
 *
 * THE PRINCIPLE GOVERNS, NOT THE LIST (packs/ro/normalize.mjs states it first): fold a
 * same-shape substitution silently; never repair a genuinely different spelling. A
 * missing OPTIONAL diacritic — "naive" typed for "naïve", "cafe" for "café" — is a
 * legitimate English spelling in its own right (both forms appear in general dictionaries)
 * and is never folded here.
 *
 * NFC first, same as every other pack — composes decomposed (NFD) input (common from
 * some paste sources) before the look-alike fold runs.
 */

/** Cyrillic look-alike → the Latin letter it is being mistaken for. Open list — see above. */
export const LOOKALIKES = {
  "а": "a", // Cyrillic а U+0430 → Latin a
  "А": "A", // Cyrillic А U+0410 → Latin A
  "е": "e", // Cyrillic е U+0435 → Latin e
  "Е": "E", // Cyrillic Е U+0415 → Latin E
  "о": "o", // Cyrillic о U+043E → Latin o
  "О": "O", // Cyrillic О U+041E → Latin O
  "р": "p", // Cyrillic р U+0440 → Latin p
  "Р": "P", // Cyrillic Р U+0420 → Latin P
  "с": "c", // Cyrillic с U+0441 → Latin c
  "С": "C", // Cyrillic С U+0421 → Latin C
  "х": "x", // Cyrillic х U+0445 → Latin x
  "Х": "X", // Cyrillic Х U+0425 → Latin X
};

/** NFC + look-alike folding. Idempotent; never touches a genuinely different spelling. */
export function normalize(s) {
  let out = String(s).normalize("NFC");
  for (const [bad, good] of Object.entries(LOOKALIKES)) out = out.split(bad).join(good);
  return out;
}
