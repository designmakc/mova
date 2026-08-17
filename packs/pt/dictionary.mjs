// mova:pack
/**
 * Portuguese fact verification, via the shared Wiktionary adapter.
 *
 * The `-ão` class is why this matters more here than in Spanish: nothing in `pão`,
 * `limão` or `mão` predicts `pães`, `limões` or `mãos`, and this pack contains no rule
 * that could. All three come back computed by Wiktionary's own module (verified
 * 2026-08-17), which is the difference between a plural a learner can trust and one the
 * agent guessed.
 */
import { createWiktionaryAdapter } from "../_shared/wiktionary.mjs";

export function createAdapter(options = {}) {
  return createWiktionaryAdapter(
    { code: "pt", language: "Portuguese", headwords: ["pt-noun"], formLabels: ["plural"] },
    options,
  );
}
