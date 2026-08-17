// mova:pack
/**
 * Greek fact verification, via the shared Wiktionary adapter.
 *
 * Greek is what forced the adapter to read gender from the MARKUP rather than from the
 * rendered text. A Greek headword renders as `βιβλίο • (vivlío) n (plural βιβλία)` — the
 * transliteration sits between the word and its gender, so the old rule, which took the
 * token after the headword, returned no gender at all for every Greek noun while looking
 * correct on five Latin-script packs (fixed 2026-08-17).
 *
 * Verified live after that fix: `βιβλίο` → n / βιβλία, `πόλη` → f / πόλεις,
 * `άνθρωπος` → m / άνθρωποι.
 */
import { createWiktionaryAdapter } from "../_shared/wiktionary.mjs";

export function createAdapter(options = {}) {
  return createWiktionaryAdapter(
    { code: "el", language: "Greek", headwords: ["el-noun"], formLabels: ["plural"] },
    options,
  );
}
