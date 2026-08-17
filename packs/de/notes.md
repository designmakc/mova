<!-- mova:pack -->
# packs/de/notes.md — German language facts for setup

> Raw input for generating an instance's `docs/reference/transfer.md` and
> `docs/mechanics/error_taxonomy.md`. Nothing here is instance state.
>
> **Provenance.** Assembled from reference grammar, **not** earned on a measured learner
> the way `packs/ro`'s codes were — every ranking is **(assumed)** until an instance's own
> error log re-ranks it. Ranked for an English-speaking learner.
>
> **This file replaces an earlier agent-generated one** whose taxonomy shipped four rows
> where the wrong form and the correction were the same string. `packcheck` now lints every
> row here for exactly that.

## Error taxonomy reference

| Code | Zone | Example error |
| --- | --- | --- |
| NOUN-GEN | noun gender | ✗ *die Buch* → das Buch |
| NOUN-PL | plural class and umlaut | ✗ *die Buchs* → die Bücher |
| CASE-AKK | accusative marking | ✗ *ich sehe der Mann* → ich sehe den Mann |
| CASE-DAT | dative marking | ✗ *mit der Mann* → mit dem Mann |
| CASE-GOV | the case a preposition or verb governs | ✗ *ich helfe ihn* → ich helfe ihm |
| ADJ-DECL | adjective endings after the article | ✗ *ein gutes Mann* → ein guter Mann |
| V2 | the finite verb in second position | ✗ *heute ich gehe nach Hause* → heute gehe ich nach Hause |
| VERB-END | verb final in a subordinate clause | ✗ *weil ich bin müde* → weil ich müde bin |
| SEP-PREF | separable prefixes | ✗ *ich aufstehe um sieben* → ich stehe um sieben auf |
| PERF-AUX | haben vs sein in the perfect | ✗ *ich habe nach Berlin gefahren* → ich bin nach Berlin gefahren |
| ORTH-UML | umlaut missing | ✗ *schon* (for *beautiful*) → schön |
| ORTH-CAP | noun capitalisation | ✗ *der tisch* → der Tisch |

### False friends — the row corrects into German, never at the English look-alike

| English word reached for | What they say | What German needs |
| --- | --- | --- |
| a gift | ✗ *ich habe ein Gift für dich gekauft* | ich habe ein Geschenk für dich gekauft |
| eventually | ✗ *eventuell ist er angekommen* | schließlich ist er angekommen |
| to become | ✗ *ich bekomme müde* | ich werde müde |
| a chef | ✗ *mein Chef kocht im Restaurant* | mein Küchenchef kocht im Restaurant |
| sensible | ✗ *eine sensible Entscheidung* | eine vernünftige Entscheidung |
| brave | ✗ *ein braver Soldat im Kampf* | ein mutiger Soldat im Kampf |
| a rock | ✗ *sie trägt einen Rock aus Stein* | sie trägt einen Felsen aus Stein |
| a handy | ✗ *das Werkzeug ist sehr handy* | das Werkzeug ist sehr praktisch |
| to blame | ✗ *ich blame ihn für den Fehler* | ich gebe ihm die Schuld für den Fehler |
| a note | ✗ *ich habe eine gute Note geschrieben, aber keine Musik* | ich habe eine gute Notiz geschrieben, aber keine Musik |

## Interference notes, ranked for an English L1

1. **The case system.** Four cases marked on articles and adjectives rather than on the
   noun, with no English equivalent beyond pronouns. It is the single largest zone.
2. **Word order.** Verb second in a main clause, verb last in a subordinate one, and the
   separable prefix that travels to the end. English word order is the wrong instinct
   everywhere.
3. **Gender**, which sense does not predict — `das Mädchen` is neuter because of its
   diminutive ending, not its meaning.
4. **Plural classes.** Five suffixes, any of which may add an umlaut, learned per noun.
5. **Adjective endings**, which depend on the article that precedes them — the same
   adjective takes three different endings in three article contexts.
6. **haben vs sein** in the perfect, and the perfect being the ordinary spoken past at all.
7. **Capitalisation of every noun**, which is mechanical but constant.

## Grammar system inventory

- **Nouns** — gender, the five plural classes, capitalisation, compounding.
- **Cases** — nominative, accusative, dative, then genitive; on articles, then on
  adjectives, then on pronouns.
- **Articles** — definite, indefinite, and the negative `kein`.
- **Adjective declension** — the three patterns (after definite, after indefinite, bare).
- **Present tense** — regular, then stem-vowel changers (`lesen → du liest`), then the
  irregular core.
- **Word order** — verb second, verb final, and the middle field.
- **Separable and inseparable prefixes.**
- **Perfect and preterite**, and which one is spoken.
- **Modal verbs**, which are high-frequency and irregular together.
- **Prepositions by case**, including the two-way prepositions with their motion rule.
- **Subordinate clauses and conjunctions.**
- **Konjunktiv II** for politeness and the unreal.

## Resource registry

- **Wiktionary (English)** — this pack's dictionary adapter: gender, plural, conjugation.
- **Duden** — the orthographic authority, and the reference for a contested spelling.
- **DWDS** — corpus evidence for how a word is actually used.
- **CEFR descriptors** — the level mapping the exams below use.
- **Goethe-Zertifikat / telc / TestDaF** — the exam families. Structure and timing belong in
  the generated goal contract, researched at setup.

## Materials sources

Learner-supplied and named at handoff: a coursebook at the target level, past papers for an
exam goal, any audio they own. Untracked in `materials/`.

**Input method is a first-session task, and German is the language where the shortcut is a
trap.** Without `ä ö ü ß` a learner reaches for `ae oe ue ss` — a real transcription
convention that this pack deliberately does NOT fold, because `Steuer` and `Museum` spell
those pairs as ordinary letters (see `pack.md`). So the digraphs will be graded as
misspellings. Installing a German layout costs a minute and removes the whole problem.
