// mova:pack
/**
 * Italian fact verification, via the shared Wiktionary adapter.
 *
 * `uovo` is the case worth knowing about: Wiktionary renders `uovo m (plural uova f)` —
 * the plural carries its OWN gender, because this is the Latin neuter remnant. The shared
 * parser reports the plural form; the gender switch is curriculum material rather than a
 * ledger fact, and the pack's notes carry it.
 */
import { createWiktionaryAdapter } from "../_shared/wiktionary.mjs";

export function createAdapter(options = {}) {
  return createWiktionaryAdapter(
    { code: "it", language: "Italian", headwords: ["it-noun"], formLabels: ["plural"] },
    options,
  );
}
