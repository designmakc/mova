<!-- mova:pack -->
# packs/fr/notes.md — French language facts for setup

> Raw input for generating an instance's `docs/reference/transfer.md` and
> `docs/mechanics/error_taxonomy.md`. Nothing here is instance state, and nothing here is a
> curriculum — setup selects from it for one learner.
>
> **Provenance.** Assembled for this pack from reference grammar, **not** earned on a
> measured learner the way `packs/ro`'s codes were. Treat every ranking as **(assumed)**
> until an instance's own error log re-ranks it.
>
> **Ranked for an English-speaking learner.** A Spanish or Italian L1 meets a different
> set — gender and the subjunctive largely transfer, false friends multiply — and setup
> must re-rank rather than copy.

## Error taxonomy reference

| Code | Zone | Example error |
| --- | --- | --- |
| NOUN-GEN | noun gender | ✗ *le maison* → la maison |
| NOUN-PL | irregular plural | ✗ *les chevals* → les chevaux |
| ADJ-AGR | adjective agreement and position | ✗ *une maison blanc* → une maison blanche |
| ART-PART | partitive article | ✗ *je bois de le café* → je bois du café |
| ART-DEF | definite article where English omits it | ✗ *j'aime musique* → j'aime la musique |
| AUX-CHOICE | avoir vs être in compound tenses | ✗ *j'ai allé au marché* → je suis allé au marché |
| PART-ACC | past participle agreement | ✗ *elle est allé* → elle est allée |
| NEG | the two-part negation | ✗ *je ne sais* → je ne sais pas |
| PRON-YEN | the pronouns y and en | ✗ *je pense de ça souvent* → j'y pense souvent |
| SUBJ | subjunctive after a trigger | ✗ *il faut que tu viens* → il faut que tu viennes |
| ORTH-ACC | accent missing or wrong | ✗ *eleve* → élève |
| PREP-VERB | the preposition a verb governs | ✗ *je commence de travailler* → je commence à travailler |

### False friends — the row corrects into French, never at the English look-alike

| English word reached for | What they say | What French needs |
| --- | --- | --- |
| actually | ✗ *actuellement je veux dire* | en fait je veux dire |
| library | ✗ *je vais à la librairie emprunter un livre* | je vais à la bibliothèque emprunter un livre |
| to attend | ✗ *j'attends la réunion* | j'assiste à la réunion |
| sensible | ✗ *une décision sensible* | une décision sensée |
| to pass (an exam) | ✗ *j'ai passé mon examen, quel soulagement* | j'ai réussi mon examen, quel soulagement |
| eventually | ✗ *éventuellement il est arrivé* | finalement il est arrivé |
| to demand | ✗ *je demande une réponse immédiate* | j'exige une réponse immédiate |
| a location | ✗ *j'ai trouvé une belle location* | j'ai trouvé un bel endroit |
| to resume | ✗ *je résume le travail après la pause* | je reprends le travail après la pause |
| a college | ✗ *mon fils étudie au collège de médecine* | mon fils étudie à la faculté de médecine |

## Interference notes, ranked for an English L1

1. **Gender**, which English gives nothing for, and which drives every article and
   adjective in the sentence.
2. **The two-part negation** `ne … pas`, where English uses one word.
3. **avoir vs être** in the compound past, plus the agreement that follows from it.
4. **The partitive** — `du`, `de la`, `des` — where English simply drops the article.
5. **y and en**, pronouns with no English equivalent at all.
6. **Written accents**, which English learners read as decoration and which change words
   (`ou`/`où`, `a`/`à`, `sur`/`sûr`).
7. **The preposition a verb governs**, memorised per verb rather than derived.

## Grammar system inventory

- **Nouns and gender** — the two classes, the ending hints and their traps, the plural
  classes (`-s`, `-x` after -eau/-eu, `-al → -aux`), and the silent-plural problem: French
  marks number in writing far more than in speech.
- **Articles** — definite, indefinite, partitive, and the contractions `du`/`des`/`au`/`aux`.
- **Adjectives** — agreement, the ones that precede, and the pairs whose meaning moves with
  position (`un grand homme` / `un homme grand`).
- **Present tense** — the three regular groups, then the irregular core.
- **The compound past** — `passé composé`, auxiliary choice, participle agreement.
- **Imperfect and the contrast with the compound past.**
- **Pronouns** — subject, direct, indirect, `y`, `en`, and their order before the verb.
- **Negation** — `ne … pas`, and the family `jamais`, `rien`, `personne`, `plus`.
- **Questions** — three registers (intonation, `est-ce que`, inversion), which is itself the
  lesson.
- **Future and conditional** — the shared stem.
- **Subjunctive** — by trigger, then the irregular core.
- **Prepositions** — `à`/`de` with places and with verbs.

## Resource registry

Seeds for an instance's `docs/reference/resources.md`; trimmed at setup, and **nothing is
bundled** (AGENTS.md invariant 5).

- **Wiktionary (English)** — this pack's dictionary adapter: gender, plural, conjugation.
- **Le Robert / Larousse** — reference dictionaries for meaning and register.
- **Académie française** — for the questions about usage a learner eventually asks.
- **CEFR descriptors** — France Éducation international publishes the level mapping used by
  the exams below.
- **DELF / DALF / TCF** — the exam families. Section structure and timing belong in the
  generated goal contract, researched at setup, not guessed here.

## Materials sources

Supplied by the learner and named at handoff as a human-only task: a coursebook at the
target level, past papers if the goal is an exam, and any audio they own. Untracked in
`materials/`.

**Input method is a first-session task.** A learner without `é è ê à ù ç` on their keyboard
will type look-alikes the normalizer folds, or drop accents entirely — which the workspace
grades as real errors, because they are. A French or US-International layout costs a minute
and prevents a class of noise the tally cannot tell from ignorance.
