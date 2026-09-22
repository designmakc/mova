<!-- mova:pack -->
# packs/en — English

Built for this template's first English instance (target learner: a Ukrainian/Russian
bilingual product designer). English has no grammatical gender and only a residue of
inflection compared to Romanian — a handful of noun plurals, verb endings, and a closed
set of irregular verb principal parts that must be memorised because no rule derives them.
This pack's tables reflect that shape rather than the reference pack's (Romanian is far
more inflection-rich): the endings list is short and the manifest's `required_fact` targets
irregular verbs specifically, not every verb.

- **POS tables** — tags for noun/verb/adjective/function-word rows, the taught endings
  (`-s`/`-es`/`-ies` plural, `-ed` past, `-ing` progressive, `-er`/`-est` comparison), and
  `required_fact: irregular-verb-principal-parts` — the one per-lexeme fact English forces
  a learner to memorise (regular verbs are 100% rule-derived from the base form; irregular
  ones — *go/went/gone*, *write/wrote/written* — are not, and there is no way to predict
  them from the spelling of the base form).
- **Normalization** — this learner types on a Cyrillic-capable keyboard layout (learner's
  own report, setup interview). The documented risk with such layouts is not a dead-key
  diacritic (English has none to speak of) but **Cyrillic/Latin homoglyphs**: several
  Cyrillic lowercase and uppercase letters are visually identical to Latin ones at normal
  reading size (Cyrillic а/е/о/р/с/х vs Latin a/e/o/p/c/x; this is the same confusable-script
  problem browser anti-spoofing / IDN-homograph guidance documents for URLs — **(assumed)**
  applied here to a learner's typed English, not independently measured against this
  learner's actual mis-keys). A stray Cyrillic keystroke inside an English word is input
  method, never a spelling error, and normalize.mjs folds it silently; a genuinely missing
  optional diacritic (e.g. *naive* for *naïve*) is untouched — English tolerates both
  spellings and it is not this workspace's place to "fix" it.
- **Dictionary** — **left empty. See "Dictionary reachability" below — this is a
  deliberate, stated gap, not an oversight.**
- **notes.md** — the raw material (error taxonomy, resource registry, materials sources,
  grammar system inventory) a setup session mines for a Russian/Ukrainian-native learner
  targeting English, re-derived for this pair rather than ported from Romanian.

## Dictionary reachability

`GENERATE.md` step 5 asks for a real adapter against the Free Dictionary API
(`https://api.dictionaryapi.dev`) when one is honestly reachable. It was tested from this
container at generation time across two rounds, five words: `design` (200, well-formed
entry), `run` (200 twice, timeout once), `light` (200 three times), `bank` (timeout every
time — HTTP 000), `xyzzynotaword` (the not-found case — HTTP 522, a Cloudflare
origin-timeout, on every attempt, never a clean 404). That last one is the decisive finding:
the adapter contract requires `lookup()` to resolve `{found:false}` for "not in the
dictionary" and *throw* for "unreachable" (`scripts/dictionary.mjs`), and this API's own
not-found path answers with the same failure signature as its downtime, from this
container, consistently. Building a parser against sometimes-200 responses would be easy;
building one that reliably tells "the word isn't there" apart from "the service is down"
is not possible against what was actually observed. That is not "reachable" in the sense
`docs/mechanics/verification.md` needs — a dictionary a session cannot count on answering
is worse than no dictionary, because a timeout must never be silently read as "not found".
**`dictionary:` is therefore left empty on purpose.** Every language fact this instance
teaches is either tutor-confirmed (no tutor is configured — see `docs/reference/profile.md`)
or carries the unverified marker; `docs/mechanics/verification.md` covers what that means
in a session. Revisiting this adapter (the parsing rules in `packs/SPEC.md` → "What a
dictionary adapter gets wrong" still apply) is a reasonable future `packs/en/` update once
network reachability from a real session is confirmed stable.

```mova-config
language: English
code: en
genders:                       # English has no grammatical gender to teach
inflection: true
level_scale: A1 A2 B1 B2 C1 C2
tts_edge:                       # not probed this session — no TTS/audio tool found in this
                                 # container (afplay/say/espeak all absent); audio: false in
                                 # profile.md, so no voice id was looked up
tts_say:                        # same reason — no macOS `say` in this container
stt_lang: en
required_fact: irregular-verb-principal-parts   # a verb row tagged (virr) must carry its
                                                 # past tense and past participle in notes —
                                                 # the one English fact no rule derives
dictionary:                     # left empty — see "Dictionary reachability" above
```
