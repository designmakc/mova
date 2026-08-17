// mova:pack
/**
 * German fact verification, via the shared Wiktionary adapter.
 *
 * The pack contains no German plural morphology, and does not need any: the headword
 * template is expanded by Wiktionary's own modules, so `Buch → Bücher`, `Stadt → Städte`
 * and `Mädchen → Mädchen` come back computed. A per-language umlaut expander was budgeted
 * for this pack and turned out to be unnecessary (2026-08-17).
 *
 * `formLabels` stays at `plural` only. A German headword also renders `genitive` and
 * `diminutive`; the genitive is a different case rather than the plural a ledger row
 * stores, and a diminutive is a different lexeme. Admitting either would let factcheck
 * accept `Büchlein` as this row's plural.
 */
import { createWiktionaryAdapter } from "../_shared/wiktionary.mjs";

export function createAdapter(options = {}) {
  return createWiktionaryAdapter(
    { code: "de", language: "German", headwords: ["de-noun"], formLabels: ["plural"] },
    options,
  );
}
