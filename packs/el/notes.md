<!-- mova:pack -->
# packs/el/notes.md — Greek language facts for setup

> Raw input for generating an instance's `docs/reference/transfer.md` and
> `docs/mechanics/error_taxonomy.md`. Nothing here is instance state.
>
> **Provenance.** Assembled from reference grammar, **not** earned on a measured learner
> the way `packs/ro`'s codes were — every ranking is **(assumed)** until an instance's own
> error log re-ranks it. Ranked for an English-speaking learner.
>
> **Modern (demotic) Greek.** Ancient Greek and Katharevousa are out of scope; a learner
> who wants them needs a different pack, not a harder curriculum.

## Error taxonomy reference

| Code | Zone | Example error |
| --- | --- | --- |
| SCRIPT-MIX | a Latin or Cyrillic homoglyph inside a Greek word | ✗ *Aθήνα* (Latin A) → Αθήνα |
| ORTH-TON | the tonos missing or misplaced | ✗ *καλημερα* → καλημέρα |
| ORTH-SIG | final sigma | ✗ *κόσμοσ* → κόσμος |
| ORTH-EI | the many spellings of /i/ — ι η υ ει οι | ✗ *ήνε* → είναι |
| NOUN-GEN | noun gender | ✗ *ο πόλη* → η πόλη |
| NOUN-DECL | plural class | ✗ *τα βιβλίοι* → τα βιβλία |
| CASE-ACC | accusative after a verb or preposition | ✗ *βλέπω ο άνθρωπος* → βλέπω τον άνθρωπο |
| CASE-GEN | genitive, including the accent shift it causes | ✗ *το βιβλίο του παιδί* → το βιβλίο του παιδιού |
| ART-DEF | the article before names and abstractions | ✗ *Μαρία είναι εδώ* → η Μαρία είναι εδώ |
| ADJ-AGR | adjective agreement | ✗ *η μεγάλος πόλη* → η μεγάλη πόλη |
| VERB-ASP | perfective vs imperfective | ✗ *θα γράφω το γράμμα αύριο* → θα γράψω το γράμμα αύριο |
| PRON-CLIT | clitic pronoun order and placement | ✗ *δίνω το σου* → σου το δίνω |

### False friends — the row corrects into Greek, never at the English look-alike

| English word reached for | What they say | What Greek needs |
| --- | --- | --- |
| empathy | ✗ *νιώθω εμπάθεια για σένα* | νιώθω ενσυναίσθηση για σένα |
| sympathetic | ✗ *ήταν συμπαθητικός στον πόνο μου* | ήταν κατανοητικός στον πόνο μου |
| idiot | ✗ *είναι ιδιώτης, δεν καταλαβαίνει τίποτα* | είναι ηλίθιος, δεν καταλαβαίνει τίποτα |
| trapeze | ✗ *πήγα στην τράπεζα να δω ακροβάτες* | πήγα στο τσίρκο να δω ακροβάτες |
| pharmacy | ✗ *πήγα στο φάρμακο να αγοράσω ασπιρίνη* | πήγα στο φαρμακείο να αγοράσω ασπιρίνη |
| gymnasium | ✗ *πάω στο γυμνάσιο να γυμναστώ* | πάω στο γυμναστήριο να γυμναστώ |
| taxi | ✗ *πήρα ένα ταξίδι στο αεροδρόμιο* | πήρα ένα ταξί στο αεροδρόμιο |
| pathologist | ✗ *ο παθολόγος εξέτασε το πτώμα* | ο ιατροδικαστής εξέτασε το πτώμα |
| crisis | ✗ *έχω κακή κρίση για το πρόβλημα* | έχω κακή γνώμη για το πρόβλημα |
| machine | ✗ *πήγα με τη μηχανή, όχι με το αυτοκίνητο, αλλά με πλυντήριο* | πήγα με τη μοτοσυκλέτα, όχι με το αυτοκίνητο |

**The false friends run in both directions and that is the trap.** English borrowed heavily
from Greek, so the learner arrives believing they already know a thousand words — and the
borrowed sense has often drifted or narrowed. `εμπάθεια` is the sharpest: it means malice,
the opposite of what an English speaker will assume.

## Interference notes, ranked for an English L1

1. **The alphabet, and the homoglyphs inside it.** Not the learning of it — that takes days
   — but the invisible mixed-script words it produces for months afterwards. This is the
   only language of the seven where the workspace's normalizer is doing structural work
   rather than tidying.
2. **The case system.** Four cases marked on the article, the noun and the adjective
   together. English has nothing to transfer.
3. **Gender**, three ways, which sense does not predict.
4. **Verbal aspect.** Greek chooses perfective or imperfective in the future and the
   subjunctive, a decision English makes with adverbs or not at all.
5. **The accent**, which is written, carries stress, and MOVES under inflection
   (`παιδί → παιδιά`, `το όνομα → του ονόματος`).
6. **The /i/ spellings.** Five ways to write the same sound (ι η υ ει οι), distinguished
   only by the word's history, which is a pure memorisation load.
7. **Clitic pronouns** and their order before the verb.
8. **The mediopassive.** Verbs whose citation form ends `-μαι` and which have no active
   counterpart (`έρχομαι`).

## Grammar system inventory

- **The alphabet and its sounds** — including the digraphs (ου, ει, αι, μπ, ντ, γκ, τσ)
  and the two-letter sounds that are not two sounds.
- **The article** — definite and indefinite, declined for gender, number and case; the one
  table that unlocks everything else.
- **Nouns** — the three genders, the declension classes, and the accent's behaviour under
  inflection.
- **Adjectives** — agreement in all three of gender, number and case.
- **Cases** — nominative, accusative, genitive, vocative; what each is for and what governs
  it.
- **Present tense** — the two conjugation groups, then the mediopassive.
- **Aspect** — the perfective/imperfective stem pair, which is a property of the verb
  learned per lexeme.
- **Past tenses** — aorist and imperfect, built on the two stems.
- **Future and subjunctive** — both formed with particles plus the aspect choice.
- **Pronouns and clitics** — strong and weak forms, and clitic order.
- **Prepositions** and the cases they take.

## Resource registry

- **Wiktionary (English)** — this pack's dictionary adapter: gender, plural.
- **Λεξικό της Κοινής Νεοελληνικής (Τριανταφυλλίδη)** — the standard reference dictionary,
  free online through the Centre for the Greek Language.
- **Πύλη για την Ελληνική Γλώσσα** — the Centre's portal, including grammar references.
- **CEFR descriptors** — the Centre for the Greek Language publishes the level mapping.
- **Πιστοποίηση Ελληνομάθειας** — the state certification, levels A1–C2. Section structure
  and timing belong in the generated goal contract, researched at setup.

## Materials sources

Learner-supplied and named at handoff: a coursebook at the target level, past papers for an
exam goal, any audio they own. Untracked in `materials/`.

**Input method is not a nicety here, it is the first task of the first session.** Every
other pack's keyboard advice is about accents; Greek needs a whole script. Without a Greek
layout the learner will either transliterate — which the workspace cannot grade — or paste
mixed-script text that looks perfect and matches nothing. Installing the Greek layout takes
a minute and removes an entire error class the tally would otherwise attribute to ignorance.
