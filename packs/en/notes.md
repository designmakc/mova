<!-- mova:pack -->
# packs/en/notes.md — English language facts for setup

> Reference material a **setup session mines** when the learner's target is English —
> raw input for generating the instance's `docs/reference/transfer.md` and error-taxonomy
> file from `setup/templates/`. Nothing here is instance state. Re-derived for a
> Russian/Ukrainian-native learner targeting English (structure modelled on
> `packs/ro/notes.md`; no Romanian content ported — codes, examples and rankings below are
> English-specific and this learner-pair-specific).
>
> Provenance: this instance's own learner is a Russian/Ukrainian bilingual (production
> language: Russian) with no prior serious English study beyond school. Every code below is
> `(assumed)` from standard, well-documented Russian/Ukrainian ↔ English contrastive facts
> (Slavic languages have no articles; Russian/Ukrainian verbs mark aspect, not the same
> tense/aspect system English builds through auxiliaries; both are highly inflected while
> English relies on word order) unless a narrower source is named. None of it has been
> measured on a real session yet — this is the starting ranking, not a verdict.

## Error taxonomy reference

The codes a Russian/Ukrainian-native learner of English hits hardest, re-ranked (not
ported) for this pair. A new instance starts from the generic taxonomy template and keeps
only the codes its learner's languages make relevant.

| Code | Zone | Example error |
| --- | --- | --- |
| ART-MISS | article omission | ✗ *I opened design file* → I opened **a/the** design file (Russian/Ukrainian have no articles at all — this is the single most persistent error class for this pair, not a minor slip) |
| ART-CHOICE | a/an/the misselection once an article is attempted | ✗ *I sent a feedback to a team* → I sent **the** feedback to **the** team (mass nouns and definiteness have no Slavic equivalent to calque from) |
| SPELL-MEM | spelling not reliably retained/reproduced | ✗ *recieve*, *seperate*, *definately* — this learner's own stated weak point (intake snapshot); English orthography is not phonetic the way Russian/Ukrainian mostly is, so sound-to-letter guessing fails often |
| VRB-3SG | third-person singular -s dropped or added wrongly | ✗ *she design the layout* → she design**s** the layout (no verb agreement marker exists in the learner's L1s the way English's single -s does) |
| VRB-TENSE | tense/aspect substitution | ✗ *I work on this project since March* → I **have been working** on this project since March (Russian/Ukrainian mark aspect on the verb itself — perfective/imperfective — not through an auxiliary system like English's simple/continuous/perfect; there is no clean 1:1 mapping) |
| VRB-PRINPART | irregular verb principal parts wrong or regularized | ✗ *I writed the spec* → I **wrote** the spec (the pack's `required_fact`: no rule derives these, purely memorised, and this learner has never studied them) |
| PREP | preposition selection | ✗ *depends of the design* → depends **on** the design; ✗ *different than* vs *different from* (English prepositions attach to verbs/adjectives idiomatically; Russian/Ukrainian case endings do work that English hands to prepositions, so there is no working transfer rule, only memorised pairs) |
| WO-ADV | adverb placement | ✗ *I read always the documentation* → I **always** read the documentation (Russian/Ukrainian allow much freer adverb placement than English's fixed mid-position slot) |
| LEX-FF | false friend | ✗ *I have sympathy for this approach* meaning "I like it" (calque of Russian «симпатия» — see transfer.md) |
| NOUN-COUNT | count/mass noun mismatch | ✗ *give me an advice*, *informations are missing* → advice/information are uncountable in English (Russian/Ukrainian have no count/mass noun grammar split of this kind) |
| WO-QINV | missing subject-auxiliary inversion in questions | ✗ *You have read this article?* → **Have you** read this article? / **Did you** read this article? (Russian/Ukrainian form questions by intonation alone, with no word-order change) |
| REG | register | using contractions/slang in a formal work-chat message, or the reverse — overly formal phrasing in Slack |

Scope rulings that keep the codes sharp:

- **ART-MISS vs ART-CHOICE** are split deliberately, not merged into one "articles" code.
  ART-MISS (no article attempted at all) is expected to dominate early — it is the direct
  consequence of an L1 pair with zero grammatical articles, a structural absence, not a
  confusion. ART-CHOICE (an article is attempted but the wrong one lands) marks real
  progress: the learner has started noticing the slot exists. Collapsing them would erase
  that signal.
- **SPELL-MEM** is scoped to the learner's *own stated* weak point (intake snapshot,
  verbatim: "плохо запоминаю слова и их написание" — poor at memorising words and their
  spelling) and is ranked this high **for this learner specifically**, not as a universal
  English-learner default. A different English learner's taxonomy would not necessarily
  promote it.
- **VRB-TENSE** is deliberately broad (it is not split into twelve tense-specific codes at
  the outset) because the underlying cause is one thing — no Slavic aspectual system maps
  cleanly onto English's auxiliary-built tense/aspect grid — and a finer split should wait
  for real session data to show which specific substitutions actually recur.
- **VRB-PRINPART is separate from VRB-TENSE.** A wrong irregular form (*writed*) is a
  memorisation gap the pack's `required_fact` exists to catch; a wrong tense/aspect choice
  (using simple past where present perfect was needed) is a system-mapping gap. Conflating
  them would send a memorisation problem to grammar drilling and vice versa.
- **PREP** stays one broad code for now, the same reasoning as VRB-TENSE: prepositions in
  English are heavily idiomatic (verb+preposition collocations) rather than rule-governed,
  so there is no clean sub-split to make ahead of data on which specific pairs this learner
  actually confuses.
- **LEX-FF** is the smallest-count code at generation time (see transfer.md for the actual
  false-friend rows) but is kept because this learner's domain — UX/UI/product design — is
  dense with English loanwords already used in Russian tech jargon with drifted meanings
  (see transfer.md rows), which is exactly where a false friend hides in plain sight.

## Resource registry

General-English resources plus UX/UI-domain-specific ones, matched to this learner's
stated goal (reading/writing for product design work, not exam prep, not conversation).

| Need | Pattern / link | Notes |
| --- | --- | --- |
| Word pronunciation + definition | `https://www.merriam-webster.com/dictionary/<word>` | monolingual, audio pronunciation, clear usage examples |
| Word in real context | `https://youglish.com/pronounce/<word>/english` | real spoken-English clips cued to the word |
| Collocations / "which preposition goes with this word" | `https://ozdic.com/` | free collocations dictionary — directly targets the PREP code above |
| Grammar reference | [Cambridge Dictionary + Grammar](https://dictionary.cambridge.org/grammar/british-grammar/) | clear A1–C2 grammar explanations, usable for VRB-TENSE and ART-* repair |
| Real UX/UI writing register | [Nielsen Norman Group articles](https://www.nngroup.com/articles/) | the actual register/genre this learner's goal targets — authentic reading material, professionally edited English |
| Design-system documentation (reading practice) | e.g. [Material Design](https://m3.material.io/), [Atlassian Design System](https://atlassian.design/) | the exact genre named in the learner's own goal scenario 1 |
| Slack-style written English practice | no single vetted link — informal work-chat register is best drilled from real (redacted) message excerpts the learner brings, per `docs/mechanics` writing playbook, not scraped |

TTS: none configured this session — no `afplay`, `say`, or `espeak` found in this
container; `audio: false`, `tts: none` in `docs/reference/profile.md`. Revisit at the next
environment check.

## Materials sources

No copyrighted material is bundled or cited here beyond public documentation sites already
free to read online (Nielsen Norman Group, Material Design, Atlassian Design System above
are all free-to-read reference sites, not textbooks to acquire). If a mock or lesson later
needs a specific paywalled article, the workspace cites it by title/section per
`materials/README.md`'s copyright rule rather than storing the text.

## Grammar system inventory

The discrete systems this instance's curriculum draws from (headings only — each will hold
5–15 aspect rows once a unit details them; the first three units in `docs/curriculum.md`
detail their aspects, later units keep only headline aspects per the rolling-wave
discipline):

- Sound/spelling system & orthography (English spelling's low sound-to-letter reliability —
  the direct target of this learner's stated SPELL-MEM weak point)
- The noun system (regular plural -s/-es/-ies, the closed irregular-plural set, count vs
  mass nouns)
- The article system (a/an/the, zero article — the single highest-priority system for this
  learner's L1 pair)
- The pronoun system (subject/object, possessive, relative — lighter-weight than Romance/
  Slavic pronoun systems but still not 1:1 with Russian/Ukrainian case-marked pronouns)
- The verb system (present/past/future built through auxiliaries, not endings; the
  progressive and perfect aspects; the closed irregular-verb principal-parts list — the
  pack's `required_fact`)
- Negation & question formation (do-support, subject-auxiliary inversion — no equivalent
  mechanism in Russian/Ukrainian)
- Adjectives & comparison (regular -er/-est vs periphrastic more/most, the irregular set)
- Prepositions (idiomatic verb/adjective + preposition collocations — the PREP code)
- Word order & sentence structure (SVO is fixed where Russian/Ukrainian order is freer;
  adverb placement — the WO-ADV code)
- Register (the specific written registers this learner's goal names: technical
  documentation, UX articles, Slack-style work chat — three different registers, not one
  generic "formal/informal" split)
- Reading strategies (skimming/scanning technical documentation and UX articles — this
  learner's stated primary goal, scenarios 1–2)
- Writing practice & spelling drill (this learner's stated weak point, scenario 5 — treated
  as its own strand, not folded into general writing practice)
- Consolidation & assessment (periodic mock writing/reading checks; no listening-heavy mock
  given the learner's explicitly secondary priority on listening, and no speaking mock at
  all — speaking was never named as a goal)
