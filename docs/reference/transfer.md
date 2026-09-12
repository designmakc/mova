<!-- mova:instance -->
# Transfer map — Russian, Ukrainian → English

> The learner's unfair advantages, catalogued — and the traps where those advantages
> lie. **Living doc**: a session that surfaces a new transfer pattern or false friend
> appends it here in the same session.
>
> Contrast policy: ranking and the never-stack rule live in
> [profile.md](profile.md) — this file is the pattern inventory, not the policy.
>
> **Measured or asserted — mark it.** Every row here is `(assumed)` at generation, mined
> first from `packs/en/notes.md`, then general Russian/Ukrainian ↔ English contrastive
> knowledge. A tested row carries `measured YYYY-MM-DD` and says how.

## Script & phonology

Both Russian and Ukrainian use Cyrillic; English uses Latin script with a single
alphabet but a notoriously unreliable sound-to-spelling mapping (unlike Russian/Ukrainian,
which are close to phonemic). This is a genuine, structural source of this learner's
stated weak point (spelling retention) — not a character-shape problem the way, say,
Georgian or Armenian learners face, but a "the letters don't reliably tell you the sound,
and the sound doesn't reliably tell you the letters" problem. `(assumed)`

- **Character confusability, not sound confusability**: several Cyrillic and Latin letters
  are visually near-identical (Cyrillic а/е/о/р/с/х vs Latin a/e/o/p/c/x) — this is a
  keyboard/input-method risk (handled by `packs/en/normalize.mjs`), not a phonological one,
  and is never scored as a spelling error. `(assumed)`
- **Consonant sounds mostly map cleanly** — /b/, /d/, /f/, /g/, /k/, /l/, /m/, /n/, /p/,
  /s/, /t/, /v/, /z/ are close enough to their Russian/Ukrainian counterparts to transfer
  directly. `(assumed)`
- **/θ/ and /ð/ (th) have no anchor in either held language** — Russian and Ukrainian have
  no interdental fricatives; the common substitution is /s/,/z/ or /t/,/d/. Neither
  language offers a better hook than the other here — both are equally silent on this
  sound. `(assumed)`
- **The English vowel inventory is considerably larger** (English distinguishes vowel
  length and quality far more than Russian/Ukrainian do — e.g. *ship*/*sheep*, *full*/
  *fool*), which is a listening-comprehension risk (scenario 4) more than a reading/writing
  one, matching this learner's stated priority (reading/writing over listening). `(assumed)`
- **Word stress is not marked in English spelling** the way it sometimes is discussed in
  Russian pedagogy (Russian stress is also unmarked in normal orthography, so this is not a
  new problem, just an unfamiliar one for a language with a much larger and less
  rule-governed stress-shift vocabulary than Russian). `(assumed)`

## Morphology traps

- **Articles (a/an/the) do not exist in Russian or Ukrainian at all** — this is not a
  category that "exists but surfaces differently" (as gender does), it is a total absence.
  This is the single highest-traffic, highest-cost trap for this learner and the reason
  `ART-MISS` leads `packs/en/notes.md`'s taxonomy. There is no productive calque route from
  either held language into English articles; the fix is pattern drilling (definite for
  something already established/unique, indefinite for something newly introduced,
  zero article for plurals/uncountables in the general case), not translation. `(assumed)`
- **English marks the third-person-singular present with a bare -s ending** (*she designs*)
  — Russian and Ukrainian verbs conjugate fully for every person, so this learner's
  instinct is actually OVER-marking risk in the other five persons is low; the trap is the
  opposite of what a from-scratch English learner usually has: dropping the ONE marked
  form because five other persons carry nothing. `(assumed)`
- **English aspect is not marked on the verb.** Russian and Ukrainian obligatorily mark
  perfective/imperfective aspect on every verb; English instead spreads a comparable
  distinction across simple/continuous/perfect constructions built with auxiliaries. There
  is no clean 1:1 substitution rule — a Russian perfective verb does not reliably map to
  "simple past" nor an imperfective one to "continuous". This is the source of `VRB-TENSE`
  in the taxonomy and is expected to be a genuinely hard, slow-to-fix area rather than a
  quick pattern-drill fix. `(assumed)`
- **English's closed irregular-verb set (go/went/gone, write/wrote/written, …) has no
  systematic Russian/Ukrainian analogue to anchor against** — Russian/Ukrainian irregular
  verbs are irregular in different, unrelated ways (aspect-pair suppletion, e.g.
  говорить/сказать), so this is pure rote memorization on the English side with no
  cross-language shortcut. This is `packs/en/pos-tables.mjs`'s `required_fact`. `(assumed)`
- **Noun plurals**: Russian/Ukrainian plural formation is far more complex (multiple
  declension classes, stress shift) than English's mostly-regular -s/-es/-ies, so if
  anything this learner's instinct undershoots English's actual difficulty here — the
  risk is applying an over-cautious "there's probably an irregular form" caution to
  regular English nouns, not under-marking real irregulars (child/children, mouse/mice).
  `(assumed)`

## Syntax order

- **English word order (SVO, fixed) is far stricter than Russian/Ukrainian**, both of which
  use case marking to keep meaning stable under much freer word order. This is a genuine
  transfer risk in both directions of the trap: this learner may produce grammatically
  "possible-sounding" but non-native English orders by transferring Russian/Ukrainian's
  freedom, most visibly in adverb placement (`WO-ADV` in the taxonomy — Russian/Ukrainian
  freely front or end-place adverbs; English mid-position adverb placement, before the
  main verb and after auxiliaries, is comparatively rigid). `(assumed)`
- **Question formation requires subject-auxiliary inversion or do-support in English**
  (*Have you read this?* / *Did you read this?*) — Russian and Ukrainian form questions by
  intonation alone with no word-order change at all, so there is zero structural transfer
  to lean on here; this is a pattern to drill from nothing, not a trap to correct an
  instinct on. `(assumed)`
- **Negation**: English requires do-support for simple-tense negation (*I don't read* vs
  Russian's direct «я не читаю» negating the verb in place) — another do-support gap with
  no held-language anchor. `(assumed)`
- **Alignment, stated with its boundary**: basic clause structure (subject before verb
  before object in the neutral case) is the SAME default in all three languages — this
  genuinely transfers, and the learner does not need to relearn "who does what to whom"
  word order for simple declarative sentences. It stops transferring the moment word order
  is doing GRAMMATICAL work rather than just default linear order — Russian/Ukrainian can
  reorder for emphasis/topic without changing case-marked meaning; English mostly cannot
  without changing meaning or sounding foreign. `(assumed)`

## False friends

Ranked by traffic × cost for THIS learner's domain (UX/UI/product design reading and
writing) — general-vocabulary false friends that this learner is unlikely to meet in that
register are deliberately excluded from the top of the table even where they are
well-known Russian/English pairs.

| English word | Looks/sounds like | Actually means | The trap |
| --- | --- | --- | --- |
| actual | "актуальный" (RU) / "актуальний" (UK) | real, existing (not "current/topical") | High traffic in work writing ("the actual design" ≠ "the current/relevant design") — this learner will reach for "actual" every time they mean "current", producing a sentence that reads as correct English but says something else `(assumed)` |
| sympathetic | "симпатичный" (RU) / "симпатичний" (UK) | feeling compassion for someone (not "likeable/nice-looking") | A design-review comment like "I find this approach sympathetic" reads as an odd, slightly off claim of pity rather than approval `(assumed)` |
| accurate | "аккуратный" (RU) / "акуратний" (UK) | precise, correct (not "neat/tidy") | "an accurate layout" sounds like a claim about correctness, not tidiness — high traffic describing UI work `(assumed)` |
| eventually | "евентуально" (dated/rare RU loan) | in the end, finally (not "possibly/maybe") | Reverses the modality — "we will eventually ship this" reads as a firm promise, not a hedge `(assumed)` |
| fabric | "фабрика" (RU/UK: factory) | cloth/material (not "factory") | Low traffic for this learner's domain but a classic pair worth flagging once met |
| genial | "гениальный" (RU) / "геніальний" (UK: brilliant) | warm and friendly (not "brilliant/genius") | Describing a colleague's idea as "genial" undersells it compared to what the learner means `(assumed)` |
| billion | "биллион" (RU, dated/rare — modern RU уже uses миллиард = English billion) | 10^9 in modern usage, matching English | Low trap risk today but historically a genuine numeric false-friend pair worth a note in a UX/data-writing context |
| magazine | "магазин" (RU/UK: shop/store) | a periodical publication (not "shop") | High-frequency everyday word; a learner reaching for "I went to the magazine" is a classic, well-documented calque |
| resin/resign | (no direct RU/UK false friend, but a target-internal near-homograph) | resin = a substance; resign = to quit a job | Target-internal confusable, high cost in a work-chat context ("I resign from this task" vs a material) — worth flagging because spelling-memory (this learner's own stated weak point) is exactly what a near-homograph pair stresses |
| control | "контроль" (RU/UK, usually "checking/inspection") | often "to manage/have power over" in English, a broader sense than RU/UK "контроль" | "design control" in English UX writing usually means governance/ownership, not inspection — subtle meaning drift rather than a hard error, but affects nuance in written feedback `(assumed)` |
| complex | "комплекс" (RU/UK, often "a set of buildings" or "an inferiority complex") | complicated (most common English sense in UX writing: "a complex interaction") | The RU/UK noun sense ("a complex" = building complex, or psychological complex) does not map to the common English adjective use in design writing — risk of reaching for the wrong part of speech |

## Register & politeness

- English work-chat register (Slack-style — this learner's scenario 3) sits on a
  formality axis Russian/Ukrainian mark very differently: Russian/Ukrainian have a
  grammaticalized T/V distinction (ты/вы, ти/ви) that English lost centuries ago — English
  marks formality lexically and through phrasing choices (contractions, hedging,
  directness) rather than through a pronoun/verb-agreement system. **Alignment, with its
  boundary**: the *instinct* to modulate formality for the audience transfers completely —
  this learner already knows to write differently to a boss than to a peer. What does NOT
  transfer is the *mechanism*: there is no English grammatical marker to reach for, so
  over-formality (default to "вы"-register habits → stiff, overly formal English in a
  casual Slack thread) is the likely direction of error, per the taxonomy's `REG` code.
  `(assumed)`
- Technical documentation and UX-article register (scenarios 1-2) is comparatively
  formality-neutral in both language pairs — this is a lower-risk register for this
  learner than work chat, since it's closer to the register already practiced in reading
  Russian/Ukrainian technical material. `(assumed)`
