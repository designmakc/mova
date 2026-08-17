<!-- mova:pack -->
# packs/pt/notes.md — Portuguese language facts for setup

> Raw input for generating an instance's `docs/reference/transfer.md` and
> `docs/mechanics/error_taxonomy.md`. Nothing here is instance state.
>
> **Provenance.** Assembled from reference grammar, **not** earned on a measured learner —
> every ranking is **(assumed)** until an instance's own error log re-ranks it. Ranked for
> an English-speaking learner; a Spanish L1 meets a different set, dominated by false
> friends and by the sounds Portuguese has that Spanish does not.
>
> **Variety:** European Portuguese by default. Where Brazilian usage diverges sharply the
> row says so; the choice belongs in the instance's goal contract.

## Error taxonomy reference

| Code | Zone | Example error |
| --- | --- | --- |
| NOUN-GEN | noun gender | ✗ *o mão* → a mão |
| NOUN-PL | the -ão plural classes | ✗ *os pãos* → os pães |
| ADJ-AGR | adjective agreement | ✗ *as casas branco* → as casas brancas |
| ART-DEF | article before possessives and names | ✗ *meu carro é novo* → o meu carro é novo |
| SER-ESTAR | ser vs estar | ✗ *estou português* → sou português |
| CONTR-PREP | preposition + article contractions | ✗ *de o livro* → do livro |
| PRON-CLIT | clitic placement | ✗ *me chamo João* → chamo-me João |
| SUBJ-PERS | the personal infinitive and the subjunctive | ✗ *é melhor tu vens* → é melhor tu vires |
| VERB-PAST | pretérito perfeito vs imperfeito | ✗ *ontem eu comia às duas* → ontem eu comi às duas |
| ORTH-TIL | the tilde | ✗ *pao* → pão |
| ORTH-ACC | written accent missing or misplaced | ✗ *cafe* → café |
| POR-PARA | por vs para | ✗ *obrigado para tudo* → obrigado por tudo |

### False friends — the row corrects into Portuguese, never at the English look-alike

| English word reached for | What they say | What Portuguese needs |
| --- | --- | --- |
| pretend | ✗ *pretendo não saber* | finjo não saber |
| push | ✗ *puxe a porta para a abrir para fora* | empurre a porta para a abrir para fora |
| costume | ✗ *vesti um costume para a festa* | vesti um fato para a festa |
| parents | ✗ *convidei os meus parentes, a minha mãe e o meu pai* | convidei os meus pais, a minha mãe e o meu pai |
| library | ✗ *vou à livraria requisitar um livro* | vou à biblioteca requisitar um livro |
| actually | ✗ *actualmente eu queria dizer* | na verdade eu queria dizer |
| exquisite | ✗ *um sabor esquisito e delicioso* | um sabor requintado e delicioso |
| to assist | ✗ *assisti o meu irmão com as malas* | ajudei o meu irmão com as malas |
| a compromise | ✗ *chegámos a um compromisso a meio caminho* | chegámos a um acordo a meio caminho |
| balcony | ✗ *saímos para o balcão ver a vista* | saímos para a varanda ver a vista |

## Interference notes, ranked for an English L1

1. **The `-ão` plural**, three classes with one ending and nothing but memory between them
   (`mãos`, `pães`, `limões`). This pack ships no rule for it deliberately — see `pack.md`.
2. **Gender**, and the traps where the ending lies (`o problema`, `a mão`, `o dia`).
3. **ser vs estar**, a split English does not make.
4. **Clitic placement**, which differs between European and Brazilian usage and is one of
   the first things that marks a learner's variety.
5. **The personal infinitive**, which exists in no other major Romance language and has no
   English counterpart at all.
6. **Nasal vowels and the tilde**, both in writing and in speech — a dropped tilde changes
   the word.
7. **Preterite vs imperfect**, which maps onto no English tense pair cleanly.

## Grammar system inventory

- **Nouns and gender** — the classes, the regular plurals, and the `-ão` split.
- **Articles** — definite and indefinite, contractions with `de`, `em`, `a`, `por`, and the
  article before possessives and given names.
- **Adjectives** — agreement and position.
- **Present tense** — the three conjugations, then the irregular core.
- **ser / estar / ficar / haver** — the split of English "to be" plus existence.
- **Past tenses** — pretérito perfeito, imperfeito, and the contrast.
- **Pronouns and clitics** — forms, placement, and the European/Brazilian divergence.
- **The personal infinitive** — the system with no English analogue.
- **Subjunctive** — present, imperfect, and the future subjunctive, which Portuguese uses
  where other Romance languages do not.
- **Prepositions** — `por` vs `para`, and contraction as a spelling system.

## Resource registry

- **Wiktionary (English)** — this pack's dictionary adapter.
- **Priberam** — the reference dictionary, with European and Brazilian forms marked.
- **Infopédia** — a second dictionary with conjugation tables.
- **CEFR descriptors** — the level mapping the exams below use.
- **CAPLE (CIPLE/DEPLE/DIPLE)** for European Portuguese, **Celpe-Bras** for Brazilian.
  Structure and timing belong in the generated goal contract, researched at setup.

## Materials sources

Learner-supplied and named at handoff: a coursebook in the right variety, past papers for
an exam goal, any audio they own. Untracked in `materials/`.

**Input method is a first-session task.** Without `ã õ á é í ó ú â ê ô ç à` on the keyboard
the learner drops diacritics that carry meaning — and in Portuguese a missing tilde is not a
typo, it is a different word. A Portuguese or US-International layout costs a minute.
