<!-- mova:pack -->
# packs/ro/notes.md — Romanian language facts for setup

> Reference material a **setup session mines** when the learner's target is Romanian —
> raw input for generating the instance's `docs/reference/transfer.md` and error-taxonomy
> file from `setup/templates/`. Nothing here is instance state. Distilled from limba's
> `docs/mechanics/error_taxonomy.md`, `docs/reference/resources.md`,
> `materials/README.md` and `docs/reference/topics.md` (as of upstream/limba.lock).
> Provenance: every code and scope note below was earned on a real learner (L1 Ukrainian,
> L2 Russian/English) — re-rank the interference notes for a different language pair.

## Error taxonomy reference

The codes limba's tally pipeline reads, with their Romanian examples. A new instance
starts from the generic taxonomy template and ports the codes relevant to its learner;
codes are appended in the session that first needs them, never invented ahead of data.

| Code | Zone | Example error |
| --- | --- | --- |
| ART-DEF | definite article (suffix) | ✗ *am citit carte* → cartea |
| ART-NDEF | indefinite article | ✗ *el este un profesor bun* misuse patterns |
| ART-POSS | possessive article al/a/ai/ale | ✗ *un prieten de-al meu* confusions, ✗ *a doilea* |
| NOUN-GEN | noun gender/plural form | ✗ *o probleme*, wrong plural ending |
| NOUN-NUM | plural produced where the singular was asked, or the reverse | ✗ *orașe* asked for **oraș** — the plural itself correct |
| CASE-GD | genitive-dative forms | ✗ *cartea de fata* → cartea fetei |
| ADJ-AGR | adjective agreement | ✗ *casă frumos* |
| VRB-CONJ | verb conjugation | wrong person/ending in present |
| VRB-SĂ | să-subjunctive | ✗ *vreau a merge / vreau merg* → vreau să merg |
| VRB-TENSE | tense choice | perfect compus vs imperfect misuse |
| CLIT-ACC | accusative clitics | ✗ *văd pe Ion* → îl văd pe Ion |
| CLIT-DAT | dative clitics | ✗ *place filmul* → îmi place filmul |
| PREP-PE | pe-marking of objects | ✗ *o cunosc Maria* → pe Maria |
| PREP-LOC | location/direction prepositions | ✗ *merg în magazin* → la (UA «в» calque) |
| ORTH-DIA | diacritics | ✗ *fara* → fără (graded error, not a typo) |
| ORTH-CG | soft/hard c and g spelling | ✗ *ingener* → inginer, ✗ *cheasi* → ceasuri (`ch` is [k], `ce` is [t͡ʃ]) |
| ORTH-VOW | vowel or diphthong choice and order | ✗ *frumaos* → frumoas(ă), ✗ *saere* → seara (only when the learner declares it genuine) |
| ORTH-SEQ | consonants of a known word dropped or transposed — the lexeme is right, the letter sequence is not | ✗ *așepta* → aștepta, ✗ *bicileta* → bicicletă (same learner-declares-it rule as ORTH-VOW) |
| PRON | pronunciation (round-trip miss) | said „fără", machine heard „fata" twice — ă not landing |
| LEX-FF | false friend / wrong-lexeme selection by similarity | ✗ *prost* meant as "simple"; also RO-internal: *a locui* / *a lucra* |
| LEX-GAP | the word is not there — output is a plausible-shaped invention | ✗ *scaulă* for **scaun**, ✗ *o bură* for **un birou** |
| LEX-END | the word is there and its final vowel is not | ✗ *peret* for **perete**, ✗ *a lucre* for **a lucra** |
| WO | word order | misplaced clitics/negation |
| REG | register | tu-forms in a formal letter |

Scope rulings that keep the codes sharp (each earned by a misrouted drill):

- **ORTH-DIA** is a diacritic absent or wrong *as a letter*. Explicitly NOT for look-alike
  codepoints from the input method (ǎ ş ţ) — those are folded by `normalize.mjs` and never
  scored.
- **ORTH-CG** is the soft/hard c/g alternation before e and i only (`ce ci` [t͡ʃ], `che chi`
  [k], `ge gi` [d͡ʒ], `ghe ghi` [g]). A spelling code, distinct from PRON: the sound is
  known, the letters are wrong. Deliberately narrow — a general "misspelling" code becomes
  the drain every slip flows into, and the tally stops pointing anywhere.
- **ORTH-VOW** is vowel/diphthong choice or order *inside* the word, and only when the
  learner, asked per item, declares it genuine. A declared slip is not coded at all.
- **ORTH-SEQ and ORTH-VOW are siblings, not a hierarchy.** One output path, two letter
  classes, and the split carries information a merged code would delete: a run of ORTH-SEQ
  with no ORTH-VOW means something different from an even mix. ORTH-SEQ takes the same
  learner-declares-it rule. A limba session produced six of these in one sitting, three of
  each class, and half of them were uncodable (2026-08-19).
- **An ORTH-SEQ entry routes to writing practice, never to re-exposure of the word.** The
  lexeme was retrieved correctly — meeting it again repairs nothing. That is the opposite
  of what LEX-GAP prescribes, which is why filing these under LEX-GAP would send drilling
  at the wrong thing. Not LEX-END either: the break is inside the stem, not the ending.
- **LEX-GAP vs NOUN-GEN**: nine wrong-gender nouns in one limba session all sat on words
  the learner could not retrieve (*scaulă, o bură, o țitili*…) — the default invention
  shape is `o …ă` because `-ă` really is a reliable feminine signal. Code the retrieval
  failure, not the shape it arrives in; the repair is an anchor, not gender drilling.
- **LEX-END vs ORTH-VOW**: position decides — the final vowel is LEX-END. The verb
  sub-case is exam-critical: a Romanian infinitive's final vowel IS its conjugation class
  (*a lucre* for *a lucra* is the wrong class, not a misspelling).
- **LEX-FF** covers any wrong-lexeme selection driven by similarity, cross-language or
  RO-internal (*a locui* / *a lucra*, *a învăța* / *a înțelege*).
- **NOUN-NUM**: the wrong member of a correct pair — not NOUN-GEN (nothing about the form
  failed), not LEX-GAP (both forms are there). The repair is a direction of asking.

## Resource registry

Vetted Romanian links (limba, 2026-07-30). `<word>` is the bare headword, URL-encoded,
diacritics where the site expects them (dexonline handles both).

Per-word URL patterns — derive, don't search:

| Need | Pattern | Notes |
| --- | --- | --- |
| Native pronunciation | `https://forvo.com/word/<word>/#ro` | real recordings; blocks bots — human-click link, don't curl |
| Word in real context | `https://youglish.com/pronounce/<word>/romanian` | YouTube clips cued to the word; stress and connected speech |
| Definition (monolingual) | `https://dexonline.ro/definitie/<word>` | THE Romanian dictionary; reading definitions is practice from ~A2 |
| Full conjugation/declension | `https://dexonline.ro/definitie/<word>/paradigma` | complete paradigm; alt `https://www.conjugare.ro/romana.php?conjugare=<verb>` |

Channels & sites:

| Resource | Use it for |
| --- | --- |
| [Romanian with Gia](https://www.youtube.com/@RomanianWithGia) | clear taught pronunciation and beginner grammar, tuned to level |
| [Easy Romanian](https://www.youtube.com/@EasyRomanianVideos) | real street conversations, RO+EN subtitles — natural speed from A2 |
| [Learn Romanian with Nico](https://www.youtube.com/@LearnRomanianWithNico) | verbs, pronunciation drills, subtitled lessons |
| [RomanianPod101](https://www.romanianpod101.com/) | structured audio lessons for a commute listening habit |
| [ILR sample tests page](https://www.ilr.ro/exemple-de-teste-pentru-autoevaluare/) | exam-format ground truth for the Romanian citizenship-track exam |
| [r/romanian](https://www.reddit.com/r/romanian/) | asking natives what a dictionary can't answer |

TTS: Microsoft Edge neural `ro-RO-EmilNeural` (male) / `ro-RO-AlinaNeural` (female);
macOS compact `Ioana` offline. STT: whisper.cpp `-l ro`. Native recordings outrank any
TTS for prosody.

## Materials sources

Acquisition targets for a Romanian instance's untracked `materials/` (copyright: cite by
unit/page, never commit content):

- **ILR self-assessment tests** (A1/A2/B1, PDF + audio) — free from ilr.ro; the
  exam-format ground truth for mocks. The site 403s scraper user agents but serves files
  to a browser UA; some Test-2 WAV links on the page are broken — the real files sit at
  `Nivel%20XX/01-Track1.wav` next to the Test-1 files.
- **"Teste de limba română A1–B1"** (Platon / Sonea / Vîlcu, UBB Cluj) — the closest thing
  to a past-paper book; buy.
- **RLS manuals**: *Manual de limba română ca limbă străină* A1–A2 and B1–B2 (Cluj
  series) — the curriculum's citation targets.
- **"Puls"** A1–A2 / B1–B2 (Daniela Kohn), with audio — alternative/supplement.
- Model exams from roexam.com; justconsult.md free B1 guide.

## Grammar system inventory

The discrete systems a Romanian curriculum tracks (limba `docs/reference/topics.md`
section headings — each holds 5–15 aspect rows in the reference instance):

- Sound system & orthography (alphabet, ă/â-î, digraphs, î/â rule, stress, non-syllabic -i)
- The noun system (three genders incl. m-sg/f-pl neuter, plurals, stem alternations, G-D, vocative)
- The article system (definite-as-suffix, indefinite, possessive al/a/ai/ale)
- The pronoun system (subject, clitics acc/dat, reflexive, demonstrative, interrogative)
- The verb system (a fi/a avea, four conjugation classes, să-subjunctive, perfect compus, imperfect, future)
- Negation & sentence type (nu, n- contraction, intonation questions)
- Adjectives & comparison (agreement classes, mai … decât)
- Prepositions & case-marking (pe-marking, la/în, governed cases)
- Numerals & quantification (0–100, de after 20, age with a avea)
- Clause syntax & connectors (word order, clitic placement, connectors)
- Register & politeness (tu/dumneavoastră, the -i/-ți endings)
- Lexical domains (greetings, family, home, professions, time…)
- Consolidation & assessment (gate mini-mocks, exam-section work)
