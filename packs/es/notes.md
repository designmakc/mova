<!-- mova:pack -->
# packs/es/notes.md — Spanish language facts for setup

> Raw input for generating an instance's `docs/reference/transfer.md` and
> `docs/mechanics/error_taxonomy.md` from `setup/templates/`. Nothing here is instance
> state, and nothing here is a curriculum — setup selects from it for one learner.
>
> **Provenance.** The error codes and the grammar inventory are A1–B1 Spanish, assembled
> for this pack rather than ported from a real learner's tally the way `packs/ro`'s were.
> Treat every ranking below as **(assumed)** until an instance's own error log re-ranks it:
> the reference pack's codes were earned on a measured learner, these were not.
>
> **Interference notes are ranked for an English-speaking learner**, the commonest case.
> A learner whose L1 is Italian, Portuguese or French meets a different set — far more
> false friends, far fewer word-order problems — and setup must re-rank rather than copy.

## Error taxonomy reference

Starter codes for the tally pipeline. An instance ports the ones relevant to its learner
and appends new codes in the session that first needs one, never ahead of data.

| Code | Zone | Example error |
| --- | --- | --- |
| NOUN-GEN | noun gender | ✗ *el mano* → la mano |
| NOUN-PL | plural formation | ✗ *los lápizes* → los lápices |
| ADJ-AGR | adjective agreement in gender and number | ✗ *las casas blanco* → las casas blancas |
| ART-DEF | definite article where English omits it | ✗ *Me gusta música* → Me gusta la música |
| SER-ESTAR | ser vs estar | ✗ *Estoy profesor* → Soy profesor |
| VERB-STEM | stem-changing verbs | ✗ *yo penso* → yo pienso |
| VERB-PAST | preterite vs imperfect | ✗ *Ayer comía a las dos* → Ayer comí a las dos |
| SUBJ | subjunctive after a trigger | ✗ *Quiero que vienes* → Quiero que vengas |
| POR-PARA | por vs para | ✗ *Gracias para todo* → Gracias por todo |
| PRON-OBJ | object pronoun choice and placement | ✗ *Yo lo doy a ella* → Se lo doy |
| ORTH-ACC | written accent missing or misplaced | ✗ *cancion* → canción |
| WORD-ORDER | adjective and question order | ✗ *una roja casa* → una casa roja |

### False friends — the row corrects into Spanish, never at the English look-alike

| English word the learner reaches for | What they say | What Spanish needs |
| --- | --- | --- |
| embarrassed | ✗ *estoy embarazada* | estoy avergonzada |
| actually | ✗ *actualmente quiero decir* | en realidad quiero decir |
| eventually | ✗ *eventualmente llegó* | finalmente llegó |
| to realize | ✗ *realicé que era tarde* | me di cuenta de que era tarde |
| to assist | ✗ *asistí a mi hermano* | ayudé a mi hermano |
| sensible | ✗ *una decisión sensible* | una decisión sensata |
| to support | ✗ *soporto a mi equipo* | apoyo a mi equipo |
| library | ✗ *fui a la librería por un libro prestado* | fui a la biblioteca por un libro prestado |
| carpet | ✗ *compré una carpeta para el suelo* | compré una alfombra para el suelo |
| exit (verb) | ✗ *voy a exitar la sala* | voy a salir de la sala |

## Interference notes, ranked for an English L1

1. **Gender is the whole game and English gives nothing.** Every noun carries it, every
   adjective and article agrees with it, and the ending is a hint rather than a rule —
   `problema`, `día`, `mapa`, `sistema`, `tema` are masculine; `mano`, `foto`, `radio` are
   feminine. This is why the ledger's noun rows carry the gender letter in the target cell.
2. **ser vs estar has no English seam.** One verb becomes two on a distinction English
   never makes, and the learner cannot feel the error.
3. **The subjunctive is a mood English lost.** It is triggered structurally, so it is
   learnable as a trigger list long before it is felt.
4. **Preterite vs imperfect** maps onto no English tense pair cleanly; "was doing" helps
   sometimes and misleads often.
5. **Written accents are not decoration** — they mark stress and distinguish words
   (`el/él`, `si/sí`, `tu/tú`, `mas/más`). English has no equivalent, so they are dropped
   first and drilled last.
6. **Word order** is freer than English, and adjective position changes meaning
   (`un gran hombre` / `un hombre grande`).

For a Romance L1 the ranking inverts: gender and the subjunctive largely transfer, and the
false-friend list becomes the dominant zone.

## Grammar system inventory

The systems an A1–B1 curriculum walks, in a defensible teaching order. Setup selects and
paces; this is the menu, not the plan.

- **Nouns and gender** — the two classes, the ending hints and their traps, plural
  formation (`-s`, `-es`, `z→ces`), the accent shifts plurals cause (`canción/canciones`,
  `joven/jóvenes`).
- **Articles** — definite and indefinite, the `el agua` rule, contractions `al`/`del`, and
  the places Spanish uses an article where English does not.
- **Adjectives** — agreement, position, and the meaning-changing pairs.
- **Present tense** — regular `-ar/-er/-ir`, then stem changes (`e→ie`, `o→ue`, `e→i`),
  then the irregular yo-forms, then the genuinely irregular verbs.
- **ser / estar / hay** — the three-way split of English "to be".
- **Pronouns** — subject (and why they are usually dropped), direct and indirect object,
  placement, and `se`.
- **Reflexives** — the verbs that are reflexive in Spanish and not in English.
- **Past tenses** — preterite, then imperfect, then the contrast, which is the real work.
- **Future and conditional** — the shared stem, the shared irregulars.
- **Subjunctive** — present subjunctive by trigger, then the common irregulars.
- **Prepositions** — `por` vs `para`, `a` before a personal object, `de` for possession.
- **Questions and negation** — the inverted-question mark, question words, double negation.

## Resource registry

Seeds for an instance's `docs/reference/resources.md`. Trimmed at setup to what serves the
goal and level; **nothing here is bundled, and no copyrighted material enters the repo**
(AGENTS.md invariant 5).

- **Real Academia Española** (`rae.es`) — the authority for spelling, and the
  *Diccionario panhispánico de dudas* for the questions a learner actually asks.
- **Wiktionary (English)** — this pack's dictionary adapter; gender, plural, conjugation.
- **Conjugation reference** — any full conjugator; the pack does not ship tables, and a
  conjugation shown to a learner is verified before it is taught.
- **CEFR descriptors** — the Instituto Cervantes *Plan curricular* is the Spanish-specific
  mapping when a goal is stated as a level.
- **DELE / SIELE** — the two exam families. Section structure and timing belong in the
  generated goal contract, researched at setup, not guessed here.

## Materials sources

What a learner supplies themselves, and setup names as a human-only task
(`playbooks/setup.md` § Handoff): a coursebook at the target level, past papers if the goal
is an exam, and any audio they own. These live untracked in `materials/`.

**Input method matters for Spanish and is a first-session task.** A learner without `ñ`,
the accented vowels and `¿`/`¡` on their keyboard will type look-alikes that the normalizer
folds, or drop accents entirely, which the workspace grades as real errors — because they
are. Setting up a Spanish layout or the US-International layout costs a minute and prevents
a class of noise the tally cannot distinguish from ignorance.
