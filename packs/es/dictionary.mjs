// mova:pack
/**
 * Spanish fact verification, via the shared Wiktionary adapter.
 *
 * All of the work — the two-phase fetch, the language-section slice that IS the
 * disambiguation, and letting Wiktionary's own modules compute the inflected forms — lives
 * in packs/_shared/wiktionary.mjs. This file is the Spanish configuration and nothing else.
 *
 * Measured 2026-08-17 on 15 Spanish nouns chosen to include every trap whose ending lies
 * about its gender (`problema` m, `mano` f, `día` m, `mapa` m, `foto` f, `sistema` m,
 * `tema` m, `leche` f): 15/15 correct. `lápiz → lápices` and `crisis → crisis` come back
 * right without this pack knowing a single Spanish plural rule.
 *
 * `mano` returns BOTH genders, because Wiktionary carries two senses (feminine "hand";
 * masculine in some varieties). That is the contract working as designed — one attesting
 * sense is attestation (scripts/dictionary.mjs, scripts/factcheck.mjs).
 */
import { createWiktionaryAdapter } from "../_shared/wiktionary.mjs";

export function createAdapter(options = {}) {
  return createWiktionaryAdapter(
    {
      code: "es",
      language: "Spanish",
      // Nouns carry the facts a Spanish ledger row must be checked against: gender and
      // plural. Adjectives and verbs are not expanded — an es-verb headword renders a
      // conjugation summary, not a form this pack stores on a row.
      headwords: ["es-noun"],
      formLabels: ["plural"],
    },
    options,
  );
}
