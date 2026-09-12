<!-- mova:instance -->
# Resources — the vetted registry

> Where sessions look before they search. **Living doc**: anything found by live search
> and shown to the learner gets appended here in the same session, with a one-line "use
> it for". Rules for *when* to reach for media: [../mechanics/media.md](../mechanics/media.md).

## Per-word URL patterns (derive, don't search)

| Need | Pattern | Notes |
| --- | --- | --- |
| Word pronunciation + definition | `https://www.merriam-webster.com/dictionary/<word>` | monolingual, audio pronunciation, clear usage examples — the closest thing this instance has to a dictionary lookup, since `packs/en/dictionary.mjs` was not built (see `docs/reference/profile.md` and `packs/en/pack.md` "Dictionary reachability") |
| Word in real context | `https://youglish.com/pronounce/<word>/english` | real spoken-English clips cued to the word |
| Collocations / preposition pairing | `https://ozdic.com/` | free collocations dictionary — targets the PREP error code directly |

## Local audio (no network)

No audio channel on this machine — `afplay`, `say`, and `espeak` were all checked at
setup and none is present in this container. `audio: false`, `tts: none` in
`docs/reference/profile.md`. Sound work (pronunciation, listening scenario 4) runs
through the linked resources above (Youglish, or Merriam-Webster's audio clips) rather
than local TTS.

## Channels & sites

| Resource | Use it for |
| --- | --- |
| [Nielsen Norman Group articles](https://www.nngroup.com/articles/) | scenario 2 reading practice — the exact register this learner's goal names, professionally edited English on UX topics |
| [Material Design](https://m3.material.io/) | scenario 1 reading practice — real design-system documentation |
| [Atlassian Design System](https://atlassian.design/) | scenario 1 reading practice — a second design-system doc source, different house style |
| [Cambridge Dictionary — Grammar](https://dictionary.cambridge.org/grammar/british-grammar/) | clear A1-C2 grammar reference, useful for VRB-TENSE and ART-* repair explanations |

## Accretion rule

New entry = one table row in the right section, added in the session that used it. If a
row turns out weak (dead link, low value), mark it struck-through with a date — the
registry records verdicts, it doesn't silently forget.
