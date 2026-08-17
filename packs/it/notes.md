<!-- mova:pack -->
# packs/it/notes.md — Italian language facts for setup

> Raw input for generating an instance's `docs/reference/transfer.md` and
> `docs/mechanics/error_taxonomy.md`. Nothing here is instance state.
>
> **Provenance.** Assembled from reference grammar, **not** earned on a measured learner
> the way `packs/ro`'s codes were. Every ranking is **(assumed)** until an instance's own
> error log re-ranks it. Ranked for an English-speaking learner; a Spanish L1 meets a very
> different set, mostly false friends and `-o`/`-a` interference.

## Error taxonomy reference

| Code | Zone | Example error |
| --- | --- | --- |
| NOUN-GEN | noun gender | ✗ *il mano* → la mano |
| NOUN-PL | plural vowel change and the h-spelling | ✗ *le amice* → le amiche |
| ADJ-AGR | adjective agreement | ✗ *le case rosso* → le case rosse |
| ART-FORM | il / lo / la and their plurals | ✗ *il studente* → lo studente |
| PREP-ART | preposition + article contractions | ✗ *di il libro* → del libro |
| AUX-CHOICE | avere vs essere in the passato prossimo | ✗ *ho andato al mercato* → sono andato al mercato |
| PART-ACC | past participle agreement with essere | ✗ *lei è andato* → lei è andata |
| PRON-CLIT | clitic pronouns and their order | ✗ *do lo a lui* → glielo do |
| SUBJ | subjunctive after a trigger | ✗ *penso che è vero* → penso che sia vero |
| ORTH-ACC | final accent missing or wrong | ✗ *citta* → città |
| ORTH-DBL | double consonants | ✗ *ano* → anno |
| PREP-VERB | the preposition a verb governs | ✗ *comincio di lavorare* → comincio a lavorare |

### False friends — the row corrects into Italian, never at the English look-alike

| English word reached for | What they say | What Italian needs |
| --- | --- | --- |
| eventually | ✗ *eventualmente è arrivato* | alla fine è arrivato |
| actually | ✗ *attualmente volevo dire* | in realtà volevo dire |
| a factory | ✗ *lavoro in una fattoria di automobili* | lavoro in una fabbrica di automobili |
| a parent | ✗ *ho invitato i miei parenti, mia madre e mio padre* | ho invitato i miei genitori, mia madre e mio padre |
| sensible | ✗ *una decisione sensibile* | una decisione sensata |
| to pretend | ✗ *pretendo di non saperlo* | faccio finta di non saperlo |
| a library | ✗ *vado in libreria a prendere un libro in prestito* | vado in biblioteca a prendere un libro in prestito |
| morbid | ✗ *un tessuto morbido mi inquieta* | un tessuto macabro mi inquieta |
| to annoy | ✗ *mi annoia questo rumore* | mi dà fastidio questo rumore |
| a camera | ✗ *ho comprato una camera nuova per le foto* | ho comprato una macchina fotografica nuova |

## Interference notes, ranked for an English L1

1. **Gender**, plus the traps where the ending lies: `il problema`, `la mano`, `il tema`.
2. **The article forms** `il`/`lo`/`la` and `i`/`gli`/`le`, chosen by the sound that follows
   rather than by the word alone.
3. **avere vs essere** in the compound past, and the agreement that follows.
4. **Clitic pronouns** — their placement before the verb and their combinations (`glielo`).
5. **Double consonants**, which are a real length distinction in speech and change words
   (`ano`/`anno`, `casa`/`cassa`).
6. **The final written accent**, which also marks stress (`città`, `perché`, `caffè`).
7. **The subjunctive**, triggered structurally and learnable as a trigger list.

## Grammar system inventory

- **Nouns and gender** — the classes, the vowel-change plurals, the h-spelling that defends
  a hard consonant (`amica/amiche`, `albergo/alberghi`), and the small closed class whose
  plural changes gender (`uovo/uova`, `braccio/braccia`) — **the fact the row's single
  gender letter cannot hold, so it is taught explicitly** (see `pack.md`).
- **Articles** — the `il`/`lo`/`la` system and the preposition contractions.
- **Adjectives** — agreement, position, `bello`/`buono` before the noun.
- **Present tense** — the three conjugations, then the irregular core.
- **Passato prossimo** — auxiliary choice, participle agreement.
- **Imperfetto** and the contrast with the passato prossimo.
- **Pronouns** — subject, direct, indirect, combined clitics, `ci` and `ne`.
- **Reflexives**, including the verbs reflexive in Italian and not in English.
- **Future and conditional.**
- **Subjunctive** — by trigger, then the irregulars.
- **Prepositions** — `a`/`in` with places, and the preposition a verb governs.

## Resource registry

- **Wiktionary (English)** — this pack's dictionary adapter.
- **Treccani** — the reference dictionary and encyclopaedia for meaning and register.
- **Accademia della Crusca** — for usage questions.
- **CEFR descriptors** — the level mapping the exams below use.
- **CILS / CELI / PLIDA** — the exam families. Structure and timing belong in the generated
  goal contract, researched at setup.

## Materials sources

Learner-supplied, named at handoff: a coursebook at the target level, past papers for an
exam goal, any audio they own. Untracked in `materials/`.

**Input method is a first-session task.** Without `à è é ì ò ù` the learner types
look-alikes the normalizer folds, or drops the accent — and a dropped final accent is a real
error the tally cannot tell from ignorance.
