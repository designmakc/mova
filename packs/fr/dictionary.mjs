// mova:pack
/**
 * French fact verification, via the shared Wiktionary adapter.
 *
 * All of the work lives in packs/_shared/wiktionary.mjs; this file is the French
 * configuration. Measured 2026-08-17 on 15 French nouns: 15/15 gender correct, and
 * `cheval → chevaux` comes back computed by Wiktionary's own module rather than by any
 * rule in this pack.
 */
import { createWiktionaryAdapter } from "../_shared/wiktionary.mjs";

export function createAdapter(options = {}) {
  return createWiktionaryAdapter(
    { code: "fr", language: "French", headwords: ["fr-noun"], formLabels: ["plural"] },
    options,
  );
}
